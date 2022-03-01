package com.bt.btbackend.security.roles;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.bt.btbackend.security.models.SecurityProperties;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseAuthException;
import com.google.firebase.auth.UserRecord;

import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class RoleServiceImpl implements RoleService {

	@Autowired
	FirebaseAuth firebaseAuth;

	@Autowired
	private SecurityProperties securityProps;

	@Override
	public void addRole(String uid, String role) throws Exception {
		try {
			UserRecord user = firebaseAuth.getUser(uid);
			Map<String, Object> claims = new HashMap<>();
			user.getCustomClaims().forEach((k, v) -> claims.put(k, v));
			if (securityProps.getValidApplicationRoles().contains(role)) {
				if (!claims.containsKey(role)) {
					claims.put(role, true);
				}
				firebaseAuth.setCustomUserClaims(uid, claims);
			} else {
				throw new Exception("Not a valid Application role, Allowed roles => "
						+ securityProps.getValidApplicationRoles().toString());
			}

		} catch (FirebaseAuthException e) {
			log.error("Firebase Auth Error ", e);
		}

	}
	@Override
	public void addManyRoles(String uid, String[] roles) throws Exception {
		for (String role:roles) {
		addRole(uid, role);
		}
	}

	@Override
	public void removeRole(String uid, String role) {
		try {
			UserRecord user = firebaseAuth.getUser(uid);
			Map<String, Object> claims = new HashMap<>();
			user.getCustomClaims().forEach((k, v) -> claims.put(k, v));
			if (claims.containsKey(role)) {
				claims.remove(role);
			}
			firebaseAuth.setCustomUserClaims(uid, claims);
		} catch (FirebaseAuthException e) {
			log.error("Firebase Auth Error ", e);
		}
	}
	@Override
	public void removeAllRoles(String uid) {
		try {
			UserRecord user = firebaseAuth.getUser(uid);
			Map<String, Object> claims = new HashMap<>();
			user.getCustomClaims().forEach((k, v) -> claims.put(k, v));
			for (String role:securityProps.getValidApplicationRoles()){
				if(!role.equals("ROLE_SUPER"))  claims.remove(role);
			}
			firebaseAuth.setCustomUserClaims(uid, claims);
		} catch (FirebaseAuthException e) {
			log.error("Firebase Auth Error ", e);
		}
	}
	@Override
	public String[] getRoles(String uid) {
		try {
			UserRecord user = firebaseAuth.getUser(uid);
			List<String> claims = new ArrayList();
			user.getCustomClaims().forEach((k, v) -> {
				if(k.contains("ROLE_")) claims.add(k);
			});
			return claims.toArray(new String[0]);
		} catch (FirebaseAuthException e) {
			log.error("Firebase Auth Error ", e);
		}
		return null;
	}




}
