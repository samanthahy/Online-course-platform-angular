package com.mercury.OnlineCoursePlatformBackend.security.handler;

import java.io.IOException;

import com.mercury.OnlineCoursePlatformBackend.security.jwt.JwtUtils;
import com.mercury.OnlineCoursePlatformBackend.security.jwt.SecurityUtils;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.stereotype.Component;

@Component
public class AuthenticationEntryPointJwtImpl implements AuthenticationEntryPoint {

	private static final Logger logger = LoggerFactory.getLogger(AuthenticationEntryPointJwtImpl.class);

/*	@Override
	public void commence(HttpServletRequest request, HttpServletResponse response, AuthenticationException exception)
			throws IOException, ServletException {
		logger.error("Unauthorized error: {}", exception.getMessage());
		if(exception instanceof BadCredentialsException) {
			SecurityUtils.sendResponse(response, HttpServletResponse.SC_UNAUTHORIZED, "Invalid username or password", exception);
		} else {
			SecurityUtils.sendResponse(response, HttpServletResponse.SC_UNAUTHORIZED, "Authentication failed", exception);
		}
	}*/


	@Override
	public void commence(HttpServletRequest request, HttpServletResponse response, AuthenticationException exception) throws IOException, ServletException {
		System.out.println("Unauthorized access attempt. Error: " + exception.getMessage());
		exception.printStackTrace();

		if(exception instanceof BadCredentialsException) {
			SecurityUtils.sendResponse(response, HttpServletResponse.SC_UNAUTHORIZED, "Invalid username or password", exception);
		} else {
			SecurityUtils.sendResponse(response, HttpServletResponse.SC_UNAUTHORIZED, "Authentication failed", exception);
		}
	}

}
