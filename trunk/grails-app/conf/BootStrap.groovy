import com.consultinglimited.crm.security.*;
import grails.converters.JSON

class BootStrap {

    /**
     * Used to create new users.
     */
    def springSecurityService

    def init = {servletContext ->
        
        // Add the necessary basic roles.
        def userRole = SecRole.findByAuthority('ROLE_USER') ?: new SecRole(authority: 'ROLE_USER').save(failOnError: true)
        def adminRole = SecRole.findByAuthority('ROLE_ADMIN') ?: new SecRole(authority: 'ROLE_ADMIN').save(failOnError: true)

        createUser('admin', 'admin', adminRole)
        createUser('administrator', 'administrator', adminRole)
        createUser('user', 'user', userRole)
        
        JSON.registerObjectMarshaller(com.consultinglimited.crm.model.DataFormListResult) {
            def returnArray = [:]
            returnArray['rows'] = it.dataFormInstanceList
            returnArray['totalRows'] = it.formDefinitionCount
            returnArray['startRow'] = it.startRow
            returnArray['endRow'] = it.endRow
            return returnArray
        };
        JSON.registerObjectMarshaller(com.consultinglimited.crm.FormDefinition) {
            def returnArray = [:]
            returnArray['id'] = it.id
            returnArray['name'] = it.name
            returnArray['formData'] = it.formData
            return returnArray
        }
        JSON.registerObjectMarshaller(com.consultinglimited.crm.model.CombinedDataForm) {
            def returnArray = [:]
            returnArray['id'] = it.getId();
            returnArray['formDefinitionId'] = it.getFormDefinitionId();
            returnArray['dataModelName'] = it.getDataModelName()
            returnArray['dataModelDescription'] = it.getDataModelDescription()
            returnArray['dataModelData'] = it.getDataModelData()
            returnArray['formDefinitionName'] = it.getFormDefinitionName()
            returnArray['formDefinitionDescription'] = it.getFormDefinitionDescription()
            returnArray['formDefinitionFormData'] = it.getFormDefinitionFormData()
            returnArray['tableDefinitionId'] = it.getTableDefinitionId()
            returnArray['tableDefinitionName'] = it.getTableDefinitionName()
            returnArray['tableDefinitionDescription'] = it.getTableDefinitionDescription()
            returnArray['tableDefinitionData'] = it.getTableDefinitionData()
            returnArray['userName'] = it.getUserName()
            return returnArray
        }
        JSON.registerObjectMarshaller(com.consultinglimited.crm.model.SmartClientResponse) {
            def returnArray = [:]
            def subArray = [:]
            returnArray['response'] = subArray;
            subArray['totalCount'] = it.totalCount;
            subArray['totalRows'] = it.totalRows
            subArray['status'] = it.status
            subArray['startRow'] = it.startRow
            subArray['endRow'] = it.endRow
            if(it.data) {
                def data = [it.data]
                subArray['data'] = data
            }
            return returnArray
        }
        JSON.registerObjectMarshaller(com.consultinglimited.crm.model.StatusResponse) {
            def returnArray = [:]
            def subArray = [:]
            returnArray['object'] = it.object;
            returnArray['errors'] = it.errors;
            returnArray['response'] = subArray;
            subArray['status'] = it.status;
            subArray['message'] = it.msg
            return returnArray
        }
        JSON.registerObjectMarshaller(com.consultinglimited.crm.security.SecUser) {
            def returnArray = [:]
            def subArray = [:]
            returnArray['response'] = subArray;
            subArray['id'] = it.id;
            subArray['accountExpired'] = it.accountExpired
            subArray['accountLocked'] = it.accountLocked
            subArray['enabled'] = it.enabled
            subArray['passwordExpired'] = it.passwordExpired
            subArray['username'] = it.username
            return returnArray
        }
        JSON.registerObjectMarshaller(com.consultinglimited.crm.security.SecRole) {
            def returnArray = [:]
            returnArray['id'] = it.id;
            returnArray['authority'] = it.authority
            return returnArray
        }
        
    }
    
    /**
     * Creates a user with a specific user name, password and a single role.
     * @param userName The name of the user.
     * @param password The password of the user.
     * @param role The role of the user.
     */
    void createUser(String userName, String password, def role) {
        
        String encoded = password;
        
        def adminUser = SecUser.findByUsername(userName) ?: new SecUser(
            username: userName,
            password: encoded,
            enabled: true).save(failOnError: true)

        if (!adminUser.authorities.contains(role)) {
            SecUserSecRole.create adminUser, role
            println("New Encoded: " + adminUser.password)
        }
    }

    def destroy = {
    }
}
