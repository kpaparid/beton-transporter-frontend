package com.bt.btbackend.security;

import com.bt.btbackend.model.Tour;
import com.bt.btbackend.model.WorkHourBankByDateDriver;
import com.bt.btbackend.security.models.User;
import com.bt.btbackend.security.roles.*;
import com.bt.btbackend.utils.ResponseHandler;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseAuthException;
import com.google.firebase.auth.UserRecord;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.support.PagedListHolder;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;


@RestController
@RequestMapping("users")
public class UserController {

    @Autowired
    private SecurityService securityService;

    @Autowired
    private RoleService roleService;

    @IsAdminPlus
    @PostMapping()
    public ResponseEntity<?> createOrUpdateUser(@RequestBody User user) {

        try {
            UserRecord record = null;
            record = securityService.createUser(user);
            if (record == null) {
                record = securityService.updateUser(user);

            }
            if (user.getRoles() != null) {
                for (String role : user.getRoles()) {
                    roleService.addRole(record.getUid(), role);
                }
            }
            return ResponseHandler.generateResponse("Successfully saved data!", HttpStatus.OK, record);
        } catch (Exception e) {
            return ResponseHandler.generateResponse(e.getMessage(), HttpStatus.MULTI_STATUS, null);
        }
    }
    @IsAdminPlus
@PutMapping("/claim/{uid}")
public ResponseEntity<?> addClaim(@RequestParam Map<String, Object> claims, @PathVariable String uid) {
    try {
        return ResponseHandler.generateResponse("Successfully saved data!", HttpStatus.OK, securityService.addCustomClaims(uid, claims));
    } catch (Exception e) {
        return ResponseHandler.generateResponse(e.getMessage(), HttpStatus.MULTI_STATUS, null);
    }

}
    @IsUserPlus
    @DeleteMapping("/{ids}")
    ResponseEntity<Object> deleteIds(@PathVariable String[] ids) {
        try {
            securityService.deleteAll(ids);
            return ResponseHandler.generateResponse("Successfully deleted data!", HttpStatus.OK, null);
        } catch (Exception e) {
            return ResponseHandler.generateResponse(e.getMessage(), HttpStatus.MULTI_STATUS, null);
        }
    }
    @IsUserPlus
    @PutMapping()
    ResponseEntity<Object> addMany(@RequestBody List<User> newEntries) {
        try {
            securityService.saveAll(newEntries);
            return ResponseHandler.generateResponse("Successfully saved data!", HttpStatus.OK, null);
        } catch (Exception e) {
            return ResponseHandler.generateResponse(e.getMessage(), HttpStatus.MULTI_STATUS, null);
        }
    }

    @GetMapping()
    public ResponseEntity<?> getEnabledUsers(Pageable pageable) {

        try {
            List<User> list = securityService.getAllUsers();
            if (pageable.getSort().isSorted()) {
                if (pageable.getSort().getOrderFor("email") != null) {
                    if (pageable.getSort().getOrderFor("email").isAscending()) {
                        list.sort(Comparator.comparing(User::getEmail).reversed());
                    } else {
                        list.sort(Comparator.comparing(User::getEmail));
                    }
                } else if (pageable.getSort().getOrderFor("name") != null) {
                    if (pageable.getSort().getOrderFor("name").isAscending()) {
                        list.sort(Comparator.comparing(User::getName).reversed());
                    } else {
                        list.sort(Comparator.comparing(User::getName));
                    }
                }
            }
            PagedListHolder<User> page = new PagedListHolder<>(list);
            page.setPageSize(pageable.getPageSize());
            page.setPage(pageable.getPageNumber());
            PageImpl<User> pageImpl = new PageImpl<>(page.getPageList(), pageable, list.size());
            return ResponseHandler.generateResponse("Successfully loaded data!", HttpStatus.OK, pageImpl);
        } catch (Exception e) {
            return ResponseHandler.generateResponse(e.getMessage(), HttpStatus.MULTI_STATUS, null);
        }
    }
    @GetMapping("/all")
    public ResponseEntity<?> getALlUsers(Pageable pageable) {

        try {
            return ResponseHandler.generateResponse("Successfully loaded data!", HttpStatus.OK, securityService.getAllUsers());
        } catch (Exception e) {
            return ResponseHandler.generateResponse(e.getMessage(), HttpStatus.MULTI_STATUS, null);
        }
    }
    @GetMapping("/{uid}")
    public ResponseEntity<?> getUserById(@PathVariable String uid) {

        try {
            return ResponseHandler.generateResponse("Successfully saved data!", HttpStatus.OK, securityService.getUserById(uid));
        } catch (Exception e) {
            return ResponseHandler.generateResponse(e.getMessage(), HttpStatus.MULTI_STATUS, null);
        }
    }

    @GetMapping("/byRole/{role}")
    public ResponseEntity<?> getUsersSuper(@PathVariable String role) {

        try {
            return ResponseHandler.generateResponse("Successfully saved data!", HttpStatus.OK, securityService.getUsersByRole(role));
        } catch (Exception e) {
            return ResponseHandler.generateResponse(e.getMessage(), HttpStatus.MULTI_STATUS, null);
        }
    }

    @GetMapping("/me")
    public ResponseEntity<?> getuser() {

        try {
            return ResponseHandler.generateResponse("Successfully saved data!", HttpStatus.OK, securityService.getUser());
        } catch (Exception e) {
            return ResponseHandler.generateResponse(e.getMessage(), HttpStatus.MULTI_STATUS, null);
        }
    }

}
