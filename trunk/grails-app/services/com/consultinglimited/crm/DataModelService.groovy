package com.consultinglimited.crm

import java.util.List;
import java.util.Map;
import com.consultinglimited.crm.model.CombinedDataForm
import com.consultinglimited.crm.security.SecUser
import com.consultinglimited.crm.security.SecRole

import com.consultinglimited.crm.DataModel;

/**
 * Contains methods related to the data model.
 */
class DataModelService {

    static transactional = true

    /**
     * Fetches the entities that are associated to a user.
     * @param user The user to which the instances are associated.
     * @param params The http parameters.
     */
    def fetchUserEntities(SecUser user, def params) {
        
        boolean isAdmin = SecRole.isAdmin(user); // Check, if this user is an administrator.
        return isAdmin ? fillCombinedList(DataModel.list(params)) : 
            fillCombinedList(DataModel.findAllBySecUser(user));
    }

    /**
     * Fills the combined list based on the data models that a user
     * can access.
     * @param dataModelList The list with data models.
     * @return a list with combined data forms.
     */
    public List<CombinedDataForm> fillCombinedList(def dataModelList) {

        List<DataModel> dmList;
        if(!(dataModelList instanceof List)) {
            dmList = [dataModelList];
        }
        else {
            dmList = dataModelList;
        }
        List<CombinedDataForm> combinedDataFormList = new ArrayList<CombinedDataForm>(dmList.size());
        for(DataModel dataModel : dmList) {
            final CombinedDataForm dataForm = new CombinedDataForm();
            final List<TableDefinition> tableDefinitionList = TableDefinition.findAllByDataModel(dataModel);
            final List<FormDefinition> formDefinitionList = FormDefinition.findAllByDataModel(dataModel);
            dataForm.dataModel = dataModel;
            if(tableDefinitionList && tableDefinitionList.size() > 0) {
                dataForm.tableDefinition = tableDefinitionList.get(0);
            }
            if(formDefinitionList && formDefinitionList.size() > 0) {
                dataForm.formDefinition = formDefinitionList.get(0);
            }
            combinedDataFormList.add(dataForm);
        }
        return combinedDataFormList;
    }
    
    /**
    * Extracts the data models from the combined data form list.
    * @param combinedDataFormList The list with all the data models, form definitions and table definitions.
    * @return The list with data models.
    */
    public Map<Long, DataModel> extractModels(List<CombinedDataForm> combinedDataFormList) {
       final Map<Long, DataModel> userDataModelMap = [:];
       for(CombinedDataForm combined : combinedDataFormList) {
           userDataModelMap.put(combined.dataModel.id, combined.dataModel)
       }
       return userDataModelMap;
   }
}
