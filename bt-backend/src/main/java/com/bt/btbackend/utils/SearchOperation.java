package com.bt.btbackend.utils;


public enum SearchOperation {
    EQUALITY, NEGATION, GREATER_THAN, LESS_THAN, LIKE, STARTS_WITH, ENDS_WITH, CONTAINS, GREATER_THAN_OR_EQUAL_TO, LESS_THAN_OR_EQUAL_TO;

    public static final String[] SIMPLE_OPERATION_SET = { "=", "_ne=", "_gte=", "_lte=", "_gt=", "_lt=", "~=" };

    public static final String OR_PREDICATE_FLAG = "'";

    public static final String ZERO_OR_MORE_REGEX = "*";

    public static final String OR_OPERATOR = "OR";

    public static final String AND_OPERATOR = "AND";

    public static final String LEFT_PARANTHESIS = "(";

    public static final String RIGHT_PARANTHESIS = ")";

    public static SearchOperation getSimpleOperation(final String input) {
        switch (input) {
            case "=":
                return EQUALITY;
            case "_ne=":
                return NEGATION;
            case "_gte=":
                return GREATER_THAN_OR_EQUAL_TO;
            case "_gt=":
                return GREATER_THAN;
            case "_lte=":
                return LESS_THAN_OR_EQUAL_TO;
            case "_lt=":
                return LESS_THAN;
            case "~=":
                return LIKE;
            default:
                return null;
        }
    }
}
