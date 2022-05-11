package com.bt.btbackend.security;

import javax.servlet.http.HttpServletRequest;

import com.bt.btbackend.security.models.Credentials;
import com.bt.btbackend.security.models.User;
import com.bt.btbackend.security.roles.RoleService;
import com.google.firebase.auth.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.util.*;
import java.util.stream.Collectors;

//import io.thepro.apiservice.security.models.Credentials;
//import io.thepro.apiservice.security.models.User;

@Service
public class SecurityService {


    @Autowired
    private RoleService roleService;

    public UserRecord createUser(User user) {
        UserRecord.CreateRequest request=null;
        try{
            request = new UserRecord.CreateRequest()
                    .setEmail(user.getEmail())
                    .setPassword(user.getPassword());
        }
        catch (Exception e){
            System.out.println(e);
        }
        if (user.getDisabled() != null) {
            request.setDisabled(user.getDisabled());
        }
        if (user.getEmailVerified() != null) {
            request.setDisabled(user.getEmailVerified());
        }
        if (user.getPhoneNumber() != null) {
            request.setPhoneNumber(user.getPhoneNumber());
        }
        if (user.getPhotoUrl() != null) {
            request.setPhotoUrl(user.getPhotoUrl());
        }
        if (user.getName() != null) {
            request.setDisplayName(user.getName());
        }
        UserRecord userRecord = null;
        try {
            userRecord = FirebaseAuth.getInstance().createUser(request);
            System.out.println("Successfully created new user: " + userRecord.getUid());
        } catch (FirebaseAuthException e) {
            e.printStackTrace();
        }
        return userRecord;
    }

    public UserRecord updateUser(User user) {
        UserRecord userRecord = null;
        try {
            userRecord = FirebaseAuth.getInstance().getUserByEmail(user.getEmail());
            UserRecord.UpdateRequest request = new UserRecord.UpdateRequest(userRecord.getUid())
                    .setEmail(user.getEmail());
            if (user.getPassword() != null) {
                request.setPassword(user.getPassword());
            }
            if (user.getDisabled() != null) {
                request.setDisabled(user.getDisabled());
            }
            if (user.getEmailVerified() != null) {
                request.setDisabled(user.getEmailVerified());
            }
            if (user.getPhoneNumber() != null) {
                request.setPhoneNumber(user.getPhoneNumber());
            }
            if (user.getPhotoUrl() != null) {
                request.setPhotoUrl(user.getPhotoUrl());
            }
            if (user.getName() != null) {
                request.setDisplayName(user.getName());
            }
            userRecord = FirebaseAuth.getInstance().updateUser(request);
            System.out.println("Successfully updated new user: " + userRecord.getUid());
        } catch (FirebaseAuthException e) {
            e.printStackTrace();
        }

        return userRecord;
    }


    public User getUser() {
        User userPrincipal = null;
        SecurityContext securityContext = SecurityContextHolder.getContext();
        Object principal = securityContext.getAuthentication().getPrincipal();
        if (principal instanceof User) {
            userPrincipal = ((User) principal);
        }
        return userPrincipal;
    }

    public UserRecord getUserById(String uid) throws FirebaseAuthException {
        return FirebaseAuth.getInstance().getUser(uid);
    }



    public List getAllUsers() {

        ListUsersPage page = null;
        List users = new ArrayList<User>();
        try {
            page = FirebaseAuth.getInstance().listUsers(null);
        } catch (FirebaseAuthException e) {
            e.printStackTrace();
        }
        for (ExportedUserRecord user : page.iterateAll()) {
            Map<String, Object> claims = user.getCustomClaims();
            String[] roles = user.getCustomClaims().keySet().stream()
                    .filter(claim -> claim.contains("ROLE_")).collect(Collectors.toList()).toArray(new String[0]);
            users.add(User.builder()
                    .uid(user.getUid())
                    .name(user.getDisplayName())
                    .email(user.getEmail())
                    .roles(roles)
                    .phoneNumber(user.getPhoneNumber())
                    .photoUrl(user.getPhotoUrl())
                    .disabled(user.isDisabled())
                    .emailVerified(user.isEmailVerified())
                    .lastSignIn(user.getUserMetadata().getLastSignInTimestamp())
                    .claims(claims)
                    .build());
        }
        return users;
    }

    public List getUsersByRole(String role) {

        ListUsersPage page = null;
        List users = new ArrayList<User>();
        try {
            page = FirebaseAuth.getInstance().listUsers(null);
        } catch (FirebaseAuthException e) {
            e.printStackTrace();
        }
        for (ExportedUserRecord user : page.iterateAll()) {
            String[] roles = user.getCustomClaims().keySet().stream().filter(claim -> claim.contains("ROLE_")).collect(Collectors.toList()).toArray(new String[0]);
            if (Arrays.asList(roles).contains(role)) {
                users.add(User.builder()
                        .uid(user.getUid())
                        .name(user.getDisplayName())
                        .email(user.getEmail())
                        .roles(roles)
                        .phoneNumber(user.getPhoneNumber())
                        .photoUrl(user.getPhotoUrl())
                        .disabled(user.isDisabled())
                        .emailVerified(user.isEmailVerified())
                        .lastSignIn(user.getUserMetadata().getLastSignInTimestamp())
                        .build());
            }

        }
        return users;
    }

    public Object addCustomClaims(String uid, Map<String, Object> claims) throws Exception {
        UserRecord user = FirebaseAuth.getInstance().getUser(uid);
        Map<String, Object> map = new HashMap<>();
        user.getCustomClaims().forEach((k, v) -> map.put(k, v));
        for (var entry : claims.entrySet()) {
            map.put(entry.getKey(), entry.getValue());
        }
        FirebaseAuth.getInstance().setCustomUserClaims(uid, map);
        return null;
    }

    public Credentials getCredentials() {
        SecurityContext securityContext = SecurityContextHolder.getContext();
        return (Credentials) securityContext.getAuthentication().getCredentials();
    }

    public String getBearerToken(HttpServletRequest request) {
        String bearerToken = null;
        String authorization = request.getHeader("Authorization");
        if (StringUtils.hasText(authorization) && authorization.startsWith("Bearer ")) {
            bearerToken = authorization.substring(7, authorization.length());
        }
        return bearerToken;
    }

    public void saveAll(List<User> newEntries) throws Exception {
        for (User user : newEntries) {
            String uid = user.getUid();
            if (uid != null) {
                String[] roles = user.getRoles();
                String[] ogRoles = roleService.getRoles(user.getUid());
                if (ogRoles != roles) {
                    roleService.removeAllRoles(uid);
                    if (roles != null) roleService.addManyRoles(uid, roles);
                }
                updateUser(user);
                addCustomClaims(uid, user.getClaims());

            } else if (user.getEmail() != null) {
                UserRecord newUser = createUser(user);
                String[] roles = user.getRoles();
                if (roles != null) roleService.addManyRoles(newUser.getUid(), roles);
                addCustomClaims(newUser.getUid(), user.getClaims());
            }
        }
    }

    public void deleteAll(String[] ids) {
        FirebaseAuth.getInstance().deleteUsersAsync(Arrays.asList(ids));

    }
}
