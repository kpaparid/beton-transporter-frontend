package com.bt.btbackend.utils;

import com.bt.btbackend.model.AbstractBaseEntity;
import org.springframework.data.jpa.domain.Specification;

import java.util.ArrayList;
import java.util.List;
import java.util.regex.Pattern;

public final class AbstractSpecificationsBuilder<T extends AbstractBaseEntity> {

    private final List<SpecSearchCriteria> params;

    public AbstractSpecificationsBuilder() {
        params = new ArrayList<>();
    }

    // API

    public final AbstractSpecificationsBuilder with(final String key, final String operation, final Object value, final String prefix, final String suffix) {
        return with(null, key, operation, value, prefix, suffix);
    }

    public final AbstractSpecificationsBuilder with(final String orPredicate, final String key, final String operation, final Object value, final String prefix, final String suffix) {
        SearchOperation op = SearchOperation.getSimpleOperation(operation);
        if (op != null) {
            if (op == SearchOperation.EQUALITY) { // the operation may be complex operation
                final boolean startWithAsterisk = prefix != null && prefix.contains(SearchOperation.ZERO_OR_MORE_REGEX);
                final boolean endWithAsterisk = suffix != null && suffix.contains(SearchOperation.ZERO_OR_MORE_REGEX);
                if (startWithAsterisk && endWithAsterisk) {
                    op = SearchOperation.CONTAINS;
                } else if (startWithAsterisk) {
                    op = SearchOperation.ENDS_WITH;
                } else if (endWithAsterisk) {
                    op = SearchOperation.STARTS_WITH;
                }
            }

            String[] values = value.toString().split(Pattern.quote(","));
            for (String v:values) {
                params.add(new SpecSearchCriteria(orPredicate, key, op, v));
            }
        }
        return this;
    }

    public Specification<T> build() {
        if (params.size() == 0)
            return null;

        Specification<T> result = new AbstractBaseSpecification(params.get(0));

        for (int i = 1; i < params.size(); i++) {
            result = params.get(i).isOrPredicate()
                    ? Specification.where(result).or(new AbstractBaseSpecification(params.get(i)))
                    : Specification.where(result).and(new AbstractBaseSpecification(params.get(i)));
        }

        return result;
    }

    public final AbstractSpecificationsBuilder with(AbstractBaseSpecification spec) {
        params.add(spec.getCriteria());
        return this;
    }

    public final AbstractSpecificationsBuilder with(SpecSearchCriteria criteria) {
        params.add(criteria);
        return this;
    }
}