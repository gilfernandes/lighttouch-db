package com.consultinglimited.crm.security

import grails.converters.JSON

/**
 * Provides security information via Ajax.
 */
class SecInfoController {

    /**
     * The Spring Security service.
     */
    def springSecurityService;
    
    /**
     * Renders information about the user as JSON to the browser.
     */
    def user = {
        def user = SecUser.get(springSecurityService.principal.id);
        render user as JSON
    }
    
    /**
    * Renders information about the user role as JSON to the browser.
    */
    def authorities = {
       def user = SecUser.get(springSecurityService.principal.id);
       render user.authorities as JSON
   }
}
