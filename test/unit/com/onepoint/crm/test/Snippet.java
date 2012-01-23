package com.onepoint.crm.test;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.nio.ByteBuffer;
import java.nio.channels.FileChannel;
import java.text.Collator;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Collections;
import java.util.Comparator;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.UUID;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import com.mongodb.BasicDBObject;
import com.mongodb.DBObject;

public class Snippet {

    /**
     * Extracts the identifier pattern.
     */
    private static final Pattern EXTRACT_ID_PAT = Pattern
            .compile("(\\d+)\\_.+");

    /**
     * Used to sort records by one single string field in ascending order.
     * 
     * @author gil
     */
    private static class AscStrComparator implements Comparator<DBObject> {

        /**
         * The UK collator.
         */
        Collator UK_COLLATOR = Collator.getInstance(Locale.UK);

        /**
         * The sorting field.
         */
        final String sortBy;

        /**
         * Associates the sorting field to this comparator.
         * 
         * @param sortBy
         *            The sorting field.
         */
        public AscStrComparator(final String sortBy) {
            this.sortBy = sortBy;
        }

        /**
         * Compares the objects using the {@code sortBy} field in ascending
         * order.
         * 
         * @param o1
         *            The first comparison object.
         * @param o2
         *            The second comparison object.
         * @return The integer result of the comparison.
         */
        public int compare(final DBObject o1, final DBObject o2) {
            final String str1 = (String) o1.get(sortBy);
            final String str2 = (String) o2.get(sortBy);
            return UK_COLLATOR.compare(str1, str2);
        }

    }

    public static void main(final String[] args) throws ParseException {
        final SimpleDateFormat STF = new SimpleDateFormat("yyyy-MM-dd HH:mm");
        final String dateStr = "1970-01-01 00:00";
        final Date d = STF.parse(dateStr);
        System.out.println(d);
        System.out.println(d.getTime());
        System.out.println(STF.format(d));
    }

    private static void numberExtract() {
        final String test = "1_given_name";
        final Pattern filterPattern = Pattern.compile("^(\\d+)\\_(.+)");
        final Matcher m = filterPattern.matcher(test);
        System.out.println(m.matches());
        System.out.println(m.group(1));
        System.out.println(m.group(2));
    }

    private static String[] extractFilterFromParam(final String str) {
        final Pattern filterPattern = Pattern.compile("^(\\d+)\\_(.+)");
        final Matcher m = filterPattern.matcher(str);
        if (m.matches()) {
            return new String[] { m.group(1), m.group(2) };
        }
        return null;
    }

    private static void createWhereExpression(final Date d) {
        final Calendar cal = Calendar.getInstance();
        final long day = 1000 * 60 * 60 * 24;
        cal.setTimeInMillis(d.getTime() + day * -1);
        final Calendar cal2 = Calendar.getInstance();
        cal2.setTimeInMillis(d.getTime() + day * 2);
        System.out.printf("this.%s > new Date(%2$tY,%2$tm,%2$te)",
                "field_name", cal);
    }

    private static void extractId() {
        final String email = "1_email";
        final Matcher m = EXTRACT_ID_PAT.matcher(email);
        if (m.matches()) {
            System.out.println(m.group(1));
        }
    }

    private static void testSort() {
        final String sortBy = "1_test";
        final String secondField = "2_field";
        final Comparator<DBObject> comparator = new AscStrComparator(sortBy);
        final List<DBObject> recordList = new ArrayList<DBObject>(10);
        final Map<String, String> map = new HashMap<String, String>();

        map.put(sortBy, "Gil");
        map.put(secondField, "Fernandes");
        recordList.add(new BasicDBObject(map));

        map.put(sortBy, "Gil");
        map.put(secondField, "Fernandes");
        recordList.add(new BasicDBObject(map));

        map.put(sortBy, "Rekha");
        map.put(secondField, "Vallyshayee");
        recordList.add(new BasicDBObject(map));

        map.put(sortBy, "Sandeep");
        map.put(secondField, "Somavarapu");
        recordList.add(new BasicDBObject(map));

        Collections.sort(recordList, comparator);

        for (final DBObject dbObj : recordList) {
            System.out.println(dbObj);
        }
    }

    private static void testUuid() {
        final String uuid = UUID.randomUUID().toString();
        System.out.println(uuid);
    }

    private static void testByteBuffer() {
        final String phrase = new String("www.java2s.com\n");

        final File aFile = new File("test.txt");
        FileOutputStream outputFile = null;
        try {
            outputFile = new FileOutputStream(aFile, true);
            System.out.println("File stream created successfully.");
        } catch (final FileNotFoundException e) {
            e.printStackTrace(System.err);
        }

        final FileChannel outChannel = outputFile.getChannel();

        final ByteBuffer buf = ByteBuffer.allocate(1024);
        System.out
                .println("New buffer:           position = " + buf.position()
                        + "\tLimit = " + buf.limit() + "\tcapacity = "
                        + buf.capacity());

        // Load the data into the buffer
        for (final char ch : phrase.toCharArray()) {
            buf.putChar(ch);
        }
        System.out
                .println("Buffer after loading: position = " + buf.position()
                        + "\tLimit = " + buf.limit() + "\tcapacity = "
                        + buf.capacity());
        buf.flip();
        System.out
                .println("Buffer after flip:    position = " + buf.position()
                        + "\tLimit = " + buf.limit() + "\tcapacity = "
                        + buf.capacity());

        try {
            outChannel.write(buf);
            outputFile.close();
            System.out.println("Buffer contents written to file.");
        } catch (final IOException e) {
            e.printStackTrace(System.err);
        }
    }
}
