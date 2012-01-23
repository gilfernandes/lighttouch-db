/**
 * 
 */
package com.consultinglimited.crm.service.impl;

import com.consultinglimited.crm.DataModel;
import com.consultinglimited.crm.service.DataModelDeployService;
import com.mongodb.DB;
import com.mongodb.DBCollection;

/**
 * Deploys the data model to a mongo database.
 * 
 * @author gil
 */
public class MongoModelDeployServiceImpl extends AbstractMongoService implements
        DataModelDeployService {

    /**
     * {@inheritDoc}
     * 
     * @see com.consultinglimited.service.DataModelDeployService#deployModel(com.consultinglimited.crm.DataModel)
     */
    public void deployModel(final DataModel dataModel, final String realm) {
        // No need to do anything here.
    }

    /**
     * {@inheritDoc}
     */
    public void dropModel(final DataModel dataModel, final String realm) {
        final DB db = mongo.getDB(realm);
        final DBCollection dbObject = fetchCollection(dataModel, db);
        dbObject.drop();
    }
}
