package com.mercury.OnlineCoursePlatformBackend.security.services;

import com.mercury.OnlineCoursePlatformBackend.model.bean.User;
import com.mercury.OnlineCoursePlatformBackend.dao.UserDao;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class UserDetailsServiceImpl implements UserDetailsService {

    @Autowired
    private UserDao userDao;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {

        User user = userDao.findByUsername(username);

        if(user == null)
            throw new UsernameNotFoundException(username + " not exist!");

        return user;
    }
}