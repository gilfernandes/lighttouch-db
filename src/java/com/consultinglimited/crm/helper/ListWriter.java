/**
 * 
 */
package com.consultinglimited.crm.helper;

import java.io.PrintWriter;
import java.io.StringWriter;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * Used to write lists with generic data to the client as JSON.
 * 
 * @author gil
 */
public class ListWriter {

    /**
     * Used to format the dates.
     */
    private static final SimpleDateFormat SDF = new SimpleDateFormat(
            "'new Date('yyyy,MM,dd,HH,mm')'");

    /**
     * The pattern used to extract the month.
     */
    private static final Pattern EXTRACT_PAT = Pattern
            .compile("new Date\\(\\d{4}\\,(\\d{2})\\,\\d{2}\\,\\d{2}\\,\\d{2}\\)");

    /**
     * Writes a generic object to the writer as JSON.
     * 
     * @param writer
     *            The servlet writer.
     * @param resultSet
     *            The result set which is to be written.
     * @param startRow
     *            The start row.
     * @param endRow
     *            The end row.
     * @param total
     *            The size of the result.
     */
    public static String writeJson(final List<Map<String, Object>> resultSet,
            final long startRow, final long endRow, final long total) {
        final StringWriter stringWriter = new StringWriter();
        final PrintWriter writer = new PrintWriter(stringWriter);
        writer.println("{response:{");
        writer.printf("totalRows:%d,", total);
        writer.printf("startRow:%d,", startRow);
        writer.printf("endRow:%d,", endRow);
        writer.printf("status:%d,", 0);
        writer.printf("queueStatus:%d,", 0);
        writer.printf("isDSResponse:%s,", true);
        writer.printf("invalidateCache:%s},", false);
        writer.println("    \"rows\": [");
        final StringBuilder builder = new StringBuilder();
        for (final Map<String, Object> map : resultSet) {
            builder.append("        {");
            for (final Entry<String, Object> entry : map.entrySet()) {
                final String key = entry.getKey();
                builder.append(String.format("\"%s\":", key));
                final Object value = entry.getValue();
                if (value instanceof String) {
                    builder.append(String.format("\"%s\",",
                            replaceLineBreak((String) value)));
                } else if (value instanceof Boolean) {
                    builder.append(String.format("%s,", value));
                } else if (value instanceof Date) {
                    builder.append(String.format("%s,", convertDate(value)));
                } else {
                    builder.append(String.format("\"%s\",", value));
                }
            }
            chompComma(builder);
            builder.append("        },");
        }
        chompComma(builder);
        writer.println(builder);
        writer.println("    ]");
        writer.println("}");
        return stringWriter.toString();
    }

    /**
     * Converts a date to a Javascript string.
     * 
     * @param value
     *            The date which is to be converted.
     * @return a Javascript string.
     */
    private static String convertDate(final Object value) {
        String str = SDF.format((Date) value);
        final Matcher m = EXTRACT_PAT.matcher(str);
        if (m.matches()) {
            final String monthStr = m.group(1);
            final int jsMonth = Integer.parseInt(monthStr) - 1;
            // Get the group's indices
            final int groupStart = m.start(1);
            final int groupEnd = m.end(1);
            str = str.substring(0, groupStart) + jsMonth
                    + str.substring(groupEnd);
            return str;
        } else {
            // Something wrong here.
            throw new IllegalStateException("Month not found in date.");
        }
    }

    /**
     * Removes the comma from the last position in a string.
     * 
     * @param builder
     *            The string builder used for removal.
     */
    private static void chompComma(final StringBuilder builder) {
        if (builder.toString().endsWith(",")) {
            builder.deleteCharAt(builder.length() - 1);
        }
    }

    /**
     * Replaces the line breaks with JSON Compatible breaks.
     * 
     * @param origStr
     *            The string with the line breaks.
     * @return the JSON compatible services.
     */
    public static String replaceLineBreak(final String origStr) {
        return origStr.replaceAll("\r?\n", "\\\\n").replace("\"", "\\\"");
    }
}
