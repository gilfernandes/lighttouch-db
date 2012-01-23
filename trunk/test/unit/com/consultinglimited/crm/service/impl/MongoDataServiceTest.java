/**
 * 
 */
package com.consultinglimited.crm.service.impl;

import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;

import junit.framework.Assert;

import org.junit.Before;
import org.junit.Test;

import com.consultinglimited.crm.DataModel;

/**
 * Test for {@code MongoDataService}.
 * 
 * @author gil
 */
public class MongoDataServiceTest {

    /**
     * The Mongo data service.
     */
    private MongoDataService mongoDataService;

    /**
     * @throws java.lang.Exception
     */
    @Before
    public void setUp() throws Exception {
        mongoDataService = new MongoDataService();
        mongoDataService.init();
    }

    /**
     * Test method for
     * {@link com.consultinglimited.crm.service.impl.MongoDataService#create(java.util.Map, com.consultinglimited.crm.DataModel, java.lang.String)}
     * .
     */
    @Test
    public void testCreate() {
        // TODO: implement this.
    }

    /**
     * Test method for
     * {@link com.consultinglimited.crm.service.impl.MongoDataService#read(com.consultinglimited.crm.DataModel, java.lang.String, long, long)}
     * .
     */
    @Test
    public void testRead() {
        final DataModel model = new DataModel();
        model.setName("singleField");
        final List<Map<String, Object>> data = mongoDataService.read(model,
                "common", 0, 100);
        for (final Map<String, Object> map : data) {
            for (final Entry<String, Object> entry : map.entrySet()) {
                final String key = entry.getKey();
                final Object value = entry.getValue();
                System.out.printf("%s: %s (%s)%n", key, value, value.getClass()
                        .getName());
            }
        }
        System.out.println(mongoDataService.totalSize(model, "common"));
    }

    /**
     * Test method for
     * {@link com.consultinglimited.crm.service.impl.MongoDataService#delete(com.consultinglimited.crm.DataModel, java.lang.String, long, long)}
     * .
     */
    @Test
    public void testDelete() {
        final DataModel model = new DataModel();
        model.setName("singleField");
        model.setModelData("{" + "\"name\": \"Comments Data\","
                + "\"fields\": [" + "{" + "\"id\": 3," + "\"title\": \"name\","
                + "\"type\": \"text\"" + "}" + "]" + "}");
        final String realm = "common";
        final Map<String, Object> valueMap = new HashMap<String, Object>();
        valueMap.put("1_name", "deleteme");
        final String id = (String) mongoDataService.create(valueMap, model,
                realm);
        System.out.println(id);
        final List<String> idList = Arrays.asList(id);
        final long deleted = mongoDataService.delete(model, realm, idList);
        Assert.assertTrue(deleted != 0);
    }
}
