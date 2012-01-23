package com.consultinglimited.crm.security

import com.consultinglimited.crm.DataModel
import com.consultinglimited.crm.SecUserRealm

class SecUser {

    transient springSecurityService

    String username
    String password
    boolean enabled
    boolean accountExpired
    boolean accountLocked
    boolean passwordExpired

    static constraints = {
        username blank: false, unique: true
        password blank: false
    }

    static mapping = { password column: '`password`' }

    /**
     * The set of security user realm objects.
     */
    static hasMany = [secUserRealms: SecUserRealm, datamodels: DataModel]

    Set<SecRole> getAuthorities() {
        SecUserSecRole.findAllBySecUser(this).collect { it.secRole } as Set
    }

    def beforeInsert() {
        encodePassword()
    }

    def beforeUpdate() {
        if (isDirty('password')) {
            encodePassword()
        }
    }

    protected void encodePassword() {
        password = springSecurityService.encodePassword(password)
    }
}

