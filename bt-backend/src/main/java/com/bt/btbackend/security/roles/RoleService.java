package com.bt.btbackend.security.roles;

public interface RoleService {

	void addRole(String uid, String role) throws Exception;

	void addManyRoles(String uid, String[] role) throws Exception;

	void removeRole(String uid, String role);

    void removeAllRoles(String uid);

    String[] getRoles(String uid);
}
