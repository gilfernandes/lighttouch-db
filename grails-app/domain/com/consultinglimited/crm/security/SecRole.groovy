package com.consultinglimited.crm.security

class SecRole {

    String authority

    static mapping = { cache true }

    static constraints = {
        authority blank: false, unique: true
    }

    /**
     * Returns {@code true}, if this user is an administrator,
     * otherwise {@code false}.
     * @param user The security user.
     * @return {@code true}, if this user is an administrator,
     * otherwise {@code false}.
     */
    static boolean isAdmin(SecUser user) {
        if(!user) {
            return false;
        }
        Collection<SecRole> roleList = user.authorities;
        boolean isAdmin = false;
        for(SecRole role : roleList) {
            if("ROLE_ADMIN".equals(role.authority)) {
                isAdmin = true;
                break;
            }
        }
        return isAdmin;
    }
}
