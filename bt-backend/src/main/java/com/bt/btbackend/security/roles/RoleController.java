package com.bt.btbackend.security.roles;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.google.firebase.auth.FirebaseAuth;

@RestController
@RequestMapping("role")
public class RoleController {

	@Autowired
	RoleService roleService;


	@Autowired
	FirebaseAuth firebaseAuth;


	@PutMapping("add")
	@IsAdminPlus
	public void addRole(@RequestParam String uid, @RequestParam String role) throws Exception {
		roleService.addRole(uid, role);
	}

	@DeleteMapping("remove")
	@IsAdminPlus
	public void removeRole(@RequestParam String uid, @RequestParam String role) {
		roleService.removeRole(uid, role);
	}



}
