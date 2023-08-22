package com.mercury.OnlineCoursePlatformBackend.service;

import com.itextpdf.text.log.LoggerFactory;
import com.mercury.OnlineCoursePlatformBackend.dao.ShoppingSessionDao;
import com.mercury.OnlineCoursePlatformBackend.http.request.RegisterRequest;
import com.mercury.OnlineCoursePlatformBackend.model.bean.Course;
import com.mercury.OnlineCoursePlatformBackend.model.bean.Profile;
import com.mercury.OnlineCoursePlatformBackend.model.bean.ShoppingSession;
import com.mercury.OnlineCoursePlatformBackend.model.bean.User;
import com.mercury.OnlineCoursePlatformBackend.dao.ProfileDao;
import com.mercury.OnlineCoursePlatformBackend.dao.UserDao;
import com.mercury.OnlineCoursePlatformBackend.http.response.Response;
import com.mercury.OnlineCoursePlatformBackend.model.dto.UserDTO;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.parameters.P;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.data.domain.Page;

import java.security.Principal;
import java.util.*;

import java.util.stream.Collectors;


@Service
public class UserService {
    @Autowired
    private UserDao userDao;

    @Autowired
    private ProfileDao profileDao;
    @Autowired
    private ShoppingSessionDao shoppingSessionDao;
    @Autowired
    private ShoppingSessionService shoppingSessionService;

    @Autowired
    private UserInfoService userInfoService;

    @Autowired
    private PasswordEncoder passwordEncoder;


    private Sort.Direction previousRoleSortDirection = Sort.Direction.ASC;





    public List<UserDTO> getAll() {
        return userDao.findAll().stream()
                .map(this::userToUserDTO)
                .collect(Collectors.toList());
    }



    public UserDTO getUserById(int id) {
        Optional<User> user = userDao.findById(id);
        if (user.isPresent()) {
            return userToUserDTO(user.get());
        } else {
            throw new RuntimeException("User with ID " + id + " not found");
        }

    }



    public UserDTO userToUserDTO(User user) {
        UserDTO userDTO = new UserDTO();
        // copy fields from user to userDto
        userDTO.setId(user.getId());
        userDTO.setUsername(user.getUsername());
        userDTO.setEmail(user.getEmail());
        userDTO.setPassword(user.getPassword());
        userDTO.setJoinedDate(user.getJoinedDate());
        userDTO.setStatus(user.getStatus());


        String role = user.getAuthorities().iterator().next().getAuthority();

/*        List<String> roles = user.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.toList());*/
/*
        List<String> roles = user.getProfiles().stream().map(Profile::getRole).collect(Collectors.toList());
*/
        userDTO.setRole(role);
        userDTO.setWishlistCourses(user.getWishlistCourses());
        return userDTO;
    }


    public Page<UserDTO> convertUserPageToUserDTOPage(Page<User> userPage) {
        return userPage.map(this::userToUserDTO);
    }



    public Page<UserDTO> getUsersWithFilterSortPaginator(Pageable pageable, String filter) {
        if (pageable.getSort().toString().contains("role")) {
            pageable = changeSortFromRoleToProfile(pageable);

            if (filter != null && !filter.trim().isEmpty()) {
                // Sorting by profile (previously role) and applying filter
                return convertUserPageToUserDTOPage(userDao.findAllFilteredAndSortedByRole(filter, pageable));
            } else {
                // Just sorting by profile (previously role) without filter
                return convertUserPageToUserDTOPage(userDao.findAllSortedByProfileRole(pageable));
            }
        } else {
            // Your existing logic
            if (filter != null && !filter.trim().isEmpty()) {
                return convertUserPageToUserDTOPage(userDao.findUsersWithFilter(filter, pageable));
            } else {
                return convertUserPageToUserDTOPage(userDao.findAll(pageable));
            }
        }
    }



    private Pageable changeSortFromRoleToProfile(Pageable pageable) {
        Sort.Order originalOrder = pageable.getSort().iterator().next(); // Assuming one sorting criteria for simplicity
        Sort newSort = Sort.by(originalOrder.getDirection(), "profile");
        return PageRequest.of(pageable.getPageNumber(), pageable.getPageSize(), newSort);
    }






    public Response register(RegisterRequest registerRequest) {
        if (userDao.existsByUsername(registerRequest.getUsername())) {
            return new Response(false, "Error: Username is already taken!");
        }

        if (userDao.existsByEmail(registerRequest.getEmail())) {
            return new Response(false, "Error: Email is already taken!");
        }

        // create new user's account
        User user = new User(registerRequest.getUsername(),
                registerRequest.getEmail(),
                passwordEncoder.encode(registerRequest.getPassword()));

/*        List<String> reqRoles = registerRequest.getRoles();
        List<Profile> profiles = new ArrayList<Profile>();

        if (reqRoles != null) {
            reqRoles.forEach(role -> {
                switch (role) {
                    case "ROLE_STUDENT" -> profiles.add(new Profile(2));
                    case "ROLE_INSTRUCTOR" -> profiles.add(new Profile(3));
                }
            });
        }*/

        String reqRole = registerRequest.getRole();
        Profile profile = null;
        if (reqRole != null) {
            switch (reqRole) {
                case "ROLE_STUDENT" -> profile = new Profile(2);
                case "ROLE_INSTRUCTOR" -> profile = new Profile(3);
            }
        }



        user.setProfile(profile);
        user.setStatus("Active");
        user.setJoinedDate(new Date());
        User savedUser = userDao.save(user);

        // Create new UserInfo for the user
        userInfoService.createUserInfo(savedUser, registerRequest.getFullname());

        // Create a shopping session for the new user
        shoppingSessionService.createShoppingSession(savedUser.getId());

        return new Response(true, "User registered successfully!");
    }





    public Response changePassword(User user, Authentication authentication) {
        if(user.getUsername().equals(authentication.getName()) || isAdmin((GrantedAuthority) authentication.getAuthorities().toArray()[0])) {
            User u = userDao.findByUsername(user.getUsername());
            u.setPassword(passwordEncoder.encode(user.getPassword()));
            userDao.save(u);
        }else {
            //TODO: Not authorize to update password if not current loggedin user or admin.
            return new Response(false);
        }
        return new Response(true);
    }

/*    @Transactional
    public Response addRoleToUser(String role, Authentication authentication) {
        System.out.println(role);
        User user = userDao.findByUsername(authentication.getName());
        List<Profile> profiles = user.getProfiles();

        Profile newProfile = null;
        switch (role) {
            case "ROLE_ADMIN" -> newProfile = new Profile(1);
            case "ROLE_STUDENT" -> newProfile = new Profile(2);
            case "ROLE_INSTRUCTOR" -> newProfile = new Profile(3);
            default -> {
                return new Response(false, 200, "Invalid role");
            }
        }

        if(!profiles.contains(newProfile)) {
            profiles.add(newProfile);
            user.setProfiles(profiles);
            userDao.save(user);
            return new Response(true, 200,"Role added successfully");
        }

        return new Response(false, 200, "Role already exists for the user");
    }*/


/*
    @Transactional
    public Response changeRoleOfUser(String role, Authentication authentication) {
        User user = userDao.findByUsername(authentication.getName());
        Profile profile = user.getProfile();

        switch (role) {
            case "ROLE_ADMIN" -> {profile.setId(1); profile.setRole("ROLE_ADMIN"); }
            case "ROLE_STUDENT" -> {profile.setId(2); profile.setRole("ROLE_STUDENT"); }
            case "ROLE_INSTRUCTOR" -> {profile.setId(3); profile.setRole("ROLE_INSTRUCTOR"); }
            default -> {
                return new Response(false, 200, "Invalid role");
            }
        }

        userDao.save(user);
        return new Response(true, 200,"Role changed successfully");
    }
*/


    @Transactional
    public Response changeToInstructorRole( String role, Authentication authentication) {
        User user = userDao.findByUsername(authentication.getName());
        Profile newProfile = null;

        switch (role) {
            case "ROLE_ADMIN" -> {newProfile = new Profile(1);}
            case "ROLE_STUDENT" -> {newProfile = new Profile(2);}
            case "ROLE_INSTRUCTOR" -> {newProfile = new Profile(3); }
            default -> {
                return new Response(false, 200, "Invalid role");
            }
        }

        user.setProfile(newProfile);
        userDao.save(user);
        return new Response(true, 200,"Role changed successfully");
    }



    @Transactional
    public Response changeRoleOfUser(UserDTO userDTO, Authentication authentication) {
        if ( isAdmin((GrantedAuthority) authentication.getAuthorities().toArray()[0])) {
            User u = userDao.findByUsername(userDTO.getUsername());
            Profile newProfile = null;
            switch (userDTO.getRole()) {
                case "ROLE_ADMIN":
                    newProfile = new Profile(1);
                    u.setProfile(newProfile);
                    break;
                case "ROLE_STUDENT":
                    newProfile = new Profile(2);
                    u.setProfile(newProfile);
                    break;
                case "ROLE_INSTRUCTOR":
                    newProfile = new Profile(3);
                    u.setProfile(newProfile);
                    break;
                default:
                    return new Response(false, 200, "Invalid role");
            }
            userDao.save(u);
            return new Response(true, 200, "Role changed successfully");
        } else {
            //TODO: Not authorize to update password if not current loggedin user or admin.
            return new Response(false, 403, "Unauthorized access");
        }
    }




    @Transactional
    public Response deactivateUser(UserDTO userDTO, Authentication authentication) {
        if ( isAdmin((GrantedAuthority) authentication.getAuthorities().toArray()[0])) {
            User u = userDao.findByUsername(userDTO.getUsername());
            u.setStatus("Deactivated");
            userDao.save(u);
            return new Response(true, 200, "Deactivate user successfully");
        } else {
            //TODO: Not authorize to update password if not current loggedin user or admin.
            return new Response(false, 403, "Unauthorized access");
        }
    }



    @Transactional
    public Response activateUser(UserDTO userDTO, Authentication authentication) {
        if ( isAdmin((GrantedAuthority) authentication.getAuthorities().toArray()[0])) {
            User u = userDao.findByUsername(userDTO.getUsername());
            u.setStatus("Active");
            userDao.save(u);
            return new Response(true, 200, "Activate user successfully");
        } else {
            //TODO: Not authorize to update password if not current loggedin user or admin.
            return new Response(false, 403, "Unauthorized access");
        }
    }



/*    public boolean isAdmin(Collection<? extends GrantedAuthority> profiles) {
        boolean isAdmin = false;
        for(GrantedAuthority profile: profiles) {
            if(profile.getAuthority().equals("ROLE_ADMIN")) {
                isAdmin = true;
            }
        };
        return isAdmin;
    }*/


    public boolean isAdmin(GrantedAuthority profile) {
        return profile.getAuthority().equals("ROLE_ADMIN");
    }


    public Response deleteUser(int id) {
        if(userDao.findById(id).get() != null) {
            userDao.deleteById(id);
            return new Response(true);
        }else {
            return new Response(false, "User is not found!");
        }
    }




}
