/**
 * 
 */
package com.consultinglimited.crm

import com.consultinglimited.crm.security.SecUser

/**
 * The many to many association of security users to realms.
 * 
 * @author gil
 *
 */
class SecUserRealm {

    /**
     * The user associated to the realm.
     */
    SecUser secUser;

    /**
     * The realm to which the user is associated.
     */
    Realm realm;

    /**
     * Links a security user to a realm.
     * @param secUser The security user.
     * @param realm The realm to which the user is associated.
     */
    static SecUserRealm link(SecUser secUser, Realm realm) {
        def m = SecUserRealm.findBySecUserAndRealm(secUser, realm);
        if (!m) {
            m = new SecUserRealm();
            secUser?.addToSecUserRealms(m)
            realm?.addToSecUserRealms(m)
            m.save()
        }
        return m;
    }

    /**
     * Unlinks a user from a realm.
     * @param secUser The security user.
     * @param realm The realm to which the user is associated.
     */
    static void unlink(SecUser secUser, Realm realm) {
        def m = SecUserRealm.findBySecUserAndRealm(secUser, realm);
        if (m) {
            secUser?.removeFromToSecUserRealms(m);
            realm?.removeFromToSecUserRealms(m);
            m.delete()
        }
    }
}
