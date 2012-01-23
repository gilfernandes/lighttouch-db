/**
 * 
 */
package com.consultinglimited.crm.helper;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * Regular expression utilities.
 * 
 * @author gil
 */
public class RegexUtil {

    /**
     * Do not use.
     */
    private RegexUtil() {
    }

    /**
     * Just extracts a filter from a parameter string.
     * 
     * @param str
     *            The string from which the filter is to be extracted.
     * @return a string array from a parameter.
     */
    public static String[] extractFilterFromParam(final String str) {
        final Pattern filterPattern = Pattern.compile("^(\\d+)\\_(.+)");
        final Matcher m = filterPattern.matcher(str);
        if (m.matches()) {
            return new String[] { m.group(1), m.group(2) };
        }
        return null;
    }
}
