package com.bt.btbackend.validation.validator;

import com.bt.btbackend.validation.annotation.IsDate;
import com.bt.btbackend.validation.annotation.IsHourMinute;

import javax.validation.ConstraintValidator;
import javax.validation.ConstraintValidatorContext;
import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

public class IsHourMinuteValidator implements ConstraintValidator<IsHourMinute, String> {

    SimpleDateFormat formatter = new SimpleDateFormat("HH:mm");

    private IsHourMinute constraintAnnotation;

    @Override
    public void initialize(IsHourMinute constraintAnnotation) {
        this.constraintAnnotation = constraintAnnotation;
    }

    @Override
    public boolean isValid(String value, ConstraintValidatorContext context) {
        try {
            if(value == null) return true;
            formatter.parse(value);
            return true;
        }
        catch (Exception ex) {
            throw new RuntimeException(ex);
        }
    }
}