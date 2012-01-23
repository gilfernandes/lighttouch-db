/**
 * 
 */
package com.consultinglimited.crm.service.model.factory;

import grails.converters.JSON;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Iterator;
import java.util.List;

import org.codehaus.groovy.grails.web.json.JSONArray;
import org.codehaus.groovy.grails.web.json.JSONObject;

import com.consultinglimited.crm.service.model.FilterCriteria;
import com.consultinglimited.crm.service.model.FilterOperator;

/**
 * Factory for filter criteria.
 * 
 * @author gil
 */
public class FilterCriteriaFactory {

    /**
     * The criteria element.
     */
    private static final String CRITERIA_ELEMENT = "criteria";

    /**
     * The element indicating that we are dealing with advanced criteria.
     */
    private static final String ADVANCED_CRITERIA = "AdvancedCriteria";

    /**
     * The parameter used to recognise the advanced criteria.
     */
    private static final String FILTER_CONSTRUCTOR_PARAM = "_constructor";

    /**
     * Creates a list of filter criterias.
     * 
     * @param criteriaJson
     *            The JSON string with the filter data.
     * @return a list of filter criterias or {@code null} in case nothing was
     *         found.
     */
    public static List<FilterCriteria> createInstances(final String criteriaJson) {

        final JSONObject criteriaData = (JSONObject) JSON.parse(criteriaJson);
        // Check first, if we are not using here the advanced criteria.
        final boolean containsConstructorType = criteriaJson
                .contains(FILTER_CONSTRUCTOR_PARAM);
        if (!containsConstructorType) {
            return extractSimple(criteriaData);
        } else {
            final String constructorType = (String) criteriaData
                    .get(FILTER_CONSTRUCTOR_PARAM);
            if (ADVANCED_CRITERIA.equals(constructorType)) {
                final List<FilterCriteria> criteriaList = new ArrayList<FilterCriteria>();
                if (criteriaData.has(CRITERIA_ELEMENT)) {
                    final JSONArray criterias = (JSONArray) criteriaData
                            .get(CRITERIA_ELEMENT);
                    for (@SuppressWarnings("unchecked")
                    final Iterator<JSONObject> iter = criterias.iterator(); iter
                            .hasNext();) {
                        final JSONObject criteria = iter.next();
                        final FilterCriteria filterCriteria = createFilterCriteria(criteria);
                        criteriaList.add(filterCriteria);
                    }
                } else {
                    return extractSimple(criteriaData);
                }
                return criteriaList;
            }
        }
        return null;
    }

    /**
     * Extracts a simple filter criteria.
     * 
     * @param criteriaData
     *            The object with the criteria data.
     * @return a simple filter criteria.
     */
    private static List<FilterCriteria> extractSimple(
            final JSONObject criteriaData) {
        final FilterCriteria filterCriteria = createFilterCriteria(criteriaData);
        return Arrays.asList(filterCriteria);
    }

    /**
     * Creates the filter criteria.
     * 
     * @param criteriaData
     *            The object with the field name, operator and value.
     * @return the filter criteria.
     */
    private static FilterCriteria createFilterCriteria(
            final JSONObject criteriaData) {
        final String fieldName = (String) criteriaData.get("fieldName");
        final String operator = (String) criteriaData.get("operator");
        final FilterOperator filterOperator = FilterOperator.find(operator);
        final Object value = criteriaData.get("value");
        final FilterCriteria filterCriteria = new FilterCriteria()
                .setFieldName(fieldName).setFilterOperator(filterOperator)
                .setValue(value);
        return filterCriteria;
    }
}
