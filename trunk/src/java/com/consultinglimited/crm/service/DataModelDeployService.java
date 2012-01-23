/**
 * 
 */
package com.consultinglimited.crm.service;

import com.consultinglimited.crm.DataModel;

/**
 * Interface used to deploy the data model.
 * 
 * @author gil
 */
public interface DataModelDeployService {

    /**
     * The default prefix for generated tables.
     */
    public static final String GEN_PREFIX = "Gen";

    /**
     * The service used to deploy the data model.
     * 
     * @param dataModel
     *            The data model to be deployed.
     * @param realm
     *            The designator of the main container into which the model is
     *            to be deployed.
     */
    public void deployModel(DataModel dataModel, final String realm);

    /**
     * This is used to drop the data model, like e.g. deleting tables.
     * 
     * @param dataModel
     *            The data model to be dropped.
     * @param realm
     *            The designator of the main container into which the model is
     *            to be deployed.
     */
    public void dropModel(DataModel dataModel, final String realm);

}
