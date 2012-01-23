package com.consultinglimited.crm.security

class UserController extends grails.plugins.springsecurity.ui.UserController {
 def save = {
        def user = lookupUserClass().newInstance(params)
        if (params.password) {
            user.password = params.password
        }
        if (!user.save(flush: true)) {
            render view: 'create', model: [user: user, authorityList: sortedRoles()]
            return
        }

        addRoles(user)
        flash.message = "${message(code: 'default.created.message', args: [message(code: 'user.label', default: 'User'), user.id])}"
        redirect action: edit, id: user.id
    }
    
    def update = {
        def user = findById()
        if (!user) return
        if (!versionCheck('user.label', 'User', user, [user: user])) {
            return
        }

        def oldPassword = user.password
        user.properties = params
        if (params.password && !params.password.equals(oldPassword)) {
            user.password = params.password
        }

        if (!user.save()) {
            render view: 'edit', model: buildUserModel(user)
            return
        }

        lookupUserRoleClass().removeAll user
        addRoles user
        userCache.removeUserFromCache user.username
        flash.message = "${message(code: 'default.updated.message', args: [message(code: 'user.label', default: 'User'), user.id])}"
        redirect action: edit, id: user.id
    }

}
