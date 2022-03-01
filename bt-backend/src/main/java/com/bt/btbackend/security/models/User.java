package com.bt.btbackend.security.models;

import java.io.Serializable;
import java.util.Map;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class User implements Serializable {

	private static final long serialVersionUID = 4408418647685225829L;
	private String uid;
	private String name;
	private String email;
	private boolean isEmailVerified;
	private String issuer;
	private String photoUrl;
	private Boolean disabled;
	private Boolean emailVerified;
	private String[] roles;
	private String phoneNumber;
	private long lastSignIn;
	private String password;
	Map<String, Object> claims;

}
