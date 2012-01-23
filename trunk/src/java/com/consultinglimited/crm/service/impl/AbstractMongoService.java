package com.consultinglimited.crm.service.impl;

import java.net.UnknownHostException;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.consultinglimited.crm.DataModel;
import com.mongodb.BasicDBList;
import com.mongodb.DB;
import com.mongodb.DBCollection;
import com.mongodb.DBObject;
import com.mongodb.Mongo;
import com.mongodb.MongoException;

/**
 * Contains the connection to the Mongo database with its configuration.
 * 
 * @author gil
 */
public abstract class AbstractMongoService {

    /**
     * Used to logging.
     */
    private static final Logger LOG = LoggerFactory
            .getLogger(AbstractMongoService.class);

    /**
     * The Mongo default identifier.
     */
    public static final String MONGO_ID = "_id";

    /**
     * The Mongo object instance actually represents a pool of connections to
     * the database. You will only need one object of class Mongo even with
     * multiple threads
     */
    protected Mongo mongo;

    /**
     * The host on which Mongo is running.
     */
    private String host = "localhost";

    /**
     * The port on which Mongo is running.
     */
    private int port = 27017;

    /**
     * Initializes the connection pool to Mongo.
     * 
     * @throws UnknownHostException
     *             In case the host is unknown.
     * @throws MongoException
     *             In case the connection to the database fails.
     */
    public void init() throws UnknownHostException, MongoException {
        mongo = new Mongo(host, port);
    }

    /**
     * Fetches a collection which in case it does not yet exist, is created
     * again.
     * 
     * @param model
     *            The original data model.
     * @param db
     *            The database where the table is available.
     * @return The collection from which to retrieve the data.
     */
    protected DBCollection fetchCollection(final DataModel model, final DB db) {
        final String modelName = fetchModelName(model);
        LOG.error("model name: " + modelName);
        final boolean collExists = db.collectionExists(modelName);
        DBCollection coll = null;
        if (!collExists) {
            final DBObject options = new BasicDBList();
            coll = db.createCollection(modelName, options);
        } else {
            coll = db.getCollection(modelName);
        }
        return coll;
    }

    /**
     * Fetches the model name in the Mongo database.
     * 
     * @param model
     *            The model definition.
     * @return the model name in the Mongo database.
     */
    protected String fetchModelName(final DataModel model) {
        final String modelName = model.getName() + "_" + model.getUuid();
        return modelName;
    }

    /**
     * Sets the MongoDB connection port.
     * 
     * @param port
     *            The MongoDB connection port.
     */
    public void setPort(final int port) {
        this.port = port;
    }

    /**
     * Sets the MongoDB host.
     * 
     * @param host
     *            The MongoDB host.
     */
    public void setHost(final String host) {
        this.host = host;
    }

}
