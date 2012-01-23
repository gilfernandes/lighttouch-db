package com.consultinglimited.crm.service.impl;

import static org.junit.Assert.*

import org.junit.Before
import org.junit.Test

import com.consultinglimited.crm.DataModel
import com.consultinglimited.crm.service.DataModelDeployService;

class DataModelDeployServiceImplTest {

    private DataModelDeployService dataModelDeployService;

    @Before
    public void setUp() throws Exception {
        dataModelDeployService = new MongoModelDeployServiceImpl();
    }

    @Test
    public void testDeployModel() {
        DataModel model = new DataModel(name: "test",
                modelData: """{"name":"firstAfterDeleteModel","fields":[{"id":1,"title":"text_field","type":"text","required":true,"minlength": "1","maxlength": "119"},{"id":2,"title":"text_area",
                    "type":"text","required":true},{"id":3,"title":"checkbox","type":"boolean"},
                    {"id":4,"title":"combo_box","type":"text","widgetType":"text"}]}""");
        String res = dataModelDeployService.generate(model);
        println(res)
    }
}
