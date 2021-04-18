# SmartSearch - User Documentation
---
SmartSearch is Learnshell's module to improve user experience whenever finding some of the documents is necessary. It provides an easy to use search box which returns the most suitable result set just as you type the query in real time. All of its features with examples are explained in the following sections. 

## Authorization
---
The module has been developed with primarily teachers on mind, which can search all of the document types. 
Students can only search their own submissions. 

## Searchable documents
---
SmartSearch allows you to search users, submissions, assignments and exams. Each document is searched using all its text and keyword fields. Based upon the type, explained in the following section, the query is parsed, analyzed and executed. Documents are returned sorted based upon how much the document matches the query.
- ***Users***
    - username (Text field)
    - first_name (Text field)
    - last_name (Text field)
    - email (Keyword field)
    - is_admin (Boolean field)
    - is_active (Boolean field)
    - date_joined (Date field)
- ***Assignments***
    - name (Text field)
    - description (Text field)
- ***Submissions***
    - assignment_name (Text field)
    - submitted_script (Text field)
    - submitter_username (Text field)
    - correction (Object field)
        - score (Integer field)
    - created_at (Date field)
- ***Exams***
    - name (Text field)

## Query types
---
The following query types are supported:
- ***Basic query*** - Is used as default query. It's  a string of arbitrary characters including punctuation and white spaces. Except those keywords and characters which modify the query as explained later: **and**, **&**, **or**, **|**, **not**, **~**. During the execution the query is split into terms and each term except the last one must be included in any order in the document to be matched. The last term is matched using its prefix.
Examples: 
    - `Create two subdirectories.` - Matches documents which contains terms: create, two and subdirectories. 
    - `forget the hidden fi` - Matches documents which contains terms: forget, hidden and any term with prefix *fi*. "The" is removed as it is an english stop word.

- ***Quoted query*** - Arbitrary string enclosed in double quotes (**"**). It's used when the order of terms matter, unlike for basic queries or whenever you want to have a term with special meaning (and, or, ...) as part of the query. Backslash (\\) can be used to escape embedded double quotes.
Examples: 
    - `"files and directories in \"$PATH\""` - Looks for documents with following phrase: *files and directories in "$PATH"*. 

- ***Specific field query*** - It's used when we want the field to have exact value. The query must have the following format: `<field_name>: <zero_or_more_whitespaces> "<value>"`. Any field mentioned above which it makes sense for can be used. Sub-fields can be accessed using dot notation as explained in following examples.
Examples: 
    - `is_admin:"true"` - Returns all users with admin privilegs.
    - `correction.score: "1"` - Returns submissions which have been corrected and received 1 point.
    - `username: "user1337"` - Returns user user1337.

**Bool operators**:
Bool operators can be used to join or negate the meaning of several queries. Nesting operators using parantheses is not supported, but might be added in the future if found necessary.

Precedence: *not > and > or* 

Left association - and, or

Right association - not

- ***And operator*** - All queries must be matched by the document to be returned. Format: `<query1> <and, &> <query2> [<and|&> <query3>, ...]`
Examples: 
    - `file and directory & path` - Three basic queries are created for each term (file, directory, path) and all must be matched by the document. The difference is that each term is used as prefix. Whereas in corresponding basic query (`file directory path`) only the last term would be used as prefix.
    - `"Assignment 2" and "variable modification"` - Creates two quoted queries and both must be matched by the document.

- ***Or operator*** - At least one of the queries must be matched by the document to be returned. Format: `<query1> <or, |> <query2> [<or, |> <query3>, ...]`
Examples: 
    - `Assignment 2 | Assignment 3 or assignment 4` - Creates three basic queries and at least one of them must be matched by the document.

- ***Not operator*** - The query must not be matched by the document to be returned. Format: `<not, ~> <query>`
Examples: 
    - `~ correction.score: "0"` Negates the meaning of the quoted query. Returns all document which have gained at least 1 point.
    - `not "Final Exam 3" and exam` - Returns all exams except the final exam 3.
    - `not count some numbers` - Not can also be used with basic queries if it is the first term in the query. Document must not be matched by terms: *count, some* and prefix *numbers*.
