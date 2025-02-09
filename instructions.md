To allow all authenticated users to access all records in the `geotranote_reports` and `infractions` tables, you need to modify the Row Level Security (RLS) policies in your Supabase project to remove any user-specific restrictions. Here's how:

1.  Go to your Supabase project dashboard.
2.  Navigate to the "Table Editor" and select the "geotranote_reports" table.
3.  Go to the "Policies" tab.
4.  Identify any policies that restrict access based on the user's ID (e.g., policies that use `auth.uid()`).
5.  Modify or remove these policies. If you want all authenticated users to have full access, you can use the following policy for SELECT, INSERT, UPDATE, and DELETE:

    ```sql
    -- For SELECT:
    CREATE POLICY "Enable read access for all users" ON "public"."geotranote_reports"
    AS PERMISSIVE FOR SELECT
    TO authenticated
    USING (TRUE);

    -- For INSERT:
    CREATE POLICY "Enable insert for all users" ON "public"."geotranote_reports"
    AS PERMISSIVE FOR INSERT
    TO authenticated
    WITH CHECK (TRUE);

    -- For UPDATE:
    CREATE POLICY "Enable update for all users" ON "public"."geotranote_reports"
    AS PERMISSIVE FOR UPDATE
    TO authenticated
    USING (TRUE)
    WITH CHECK (TRUE);

    -- For DELETE:
    CREATE POLICY "Enable delete for all users" ON "public"."geotranote_reports"
    AS PERMISSIVE FOR DELETE
    TO authenticated
    USING (TRUE);
    ```

    These policies allow any authenticated user to perform any operation on the table. The `USING (TRUE)` and `WITH CHECK (TRUE)` clauses mean that there are no additional restrictions on the data being accessed or modified.

6.  Repeat steps 2-5 for the "infractions" table, applying similar policies to allow full access for all authenticated users:

    ```sql
    -- For SELECT:
    CREATE POLICY "Enable read access for all users" ON "public"."infractions"
    AS PERMISSIVE FOR SELECT
    TO authenticated
    USING (TRUE);

    -- For INSERT:
    CREATE POLICY "Enable insert for all users" ON "public"."infractions"
    AS PERMISSIVE FOR INSERT
    TO authenticated
    WITH CHECK (TRUE);

    -- For UPDATE:
    CREATE POLICY "Enable update for all users" ON "public"."infractions"
    AS PERMISSIVE FOR UPDATE
    TO authenticated
    USING (TRUE)
    WITH CHECK (TRUE);

    -- For DELETE:
    CREATE POLICY "Enable delete for all users" ON "public"."infractions"
    AS PERMISSIVE FOR DELETE
    TO authenticated
    USING (TRUE);
    ```

7.  After making these changes, test your application to ensure that all authenticated users can access and modify all data in the tables.

**Important Considerations:**

*   **Security:** Be aware that removing user-specific restrictions means that any authenticated user will be able to see and modify all data in your tables. This may not be appropriate for all applications.
*   **Alternative Approaches:** If you need to restrict access to certain data based on roles or other criteria, you can create more complex RLS policies that take these factors into account.
*   **Testing:** Thoroughly test your RLS policies to ensure that they are working as expected and that you have not inadvertently exposed sensitive data.
