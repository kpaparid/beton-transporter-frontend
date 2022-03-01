package com.bt.btbackend.validation.annotation;

import com.bt.btbackend.validation.validator.IsHourMinuteValidator;

import javax.validation.Constraint;
import javax.validation.Payload;
import java.lang.annotation.*;

@Documented
@Constraint(validatedBy = IsHourMinuteValidator.class)
@Target({ElementType.METHOD, ElementType.FIELD, ElementType.ANNOTATION_TYPE})
@Retention(RetentionPolicy.RUNTIME)
public @interface IsHourMinute {
    String message() default "{validation.date.IsHourMinute.message}";
    Class<?>[] groups() default {};
    Class<? extends Payload>[] payload() default {};
}