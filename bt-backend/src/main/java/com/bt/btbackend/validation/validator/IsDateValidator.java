package com.bt.btbackend.validation.validator;

import com.bt.btbackend.validation.annotation.IsDate;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.time.YearMonth;
import java.time.format.DateTimeFormatter;
import java.util.Date;
import javax.validation.ConstraintValidator;
import javax.validation.ConstraintValidatorContext;

public class IsDateValidator implements ConstraintValidator<IsDate, String> {

    DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy.MM.dd");

    private IsDate constraintAnnotation;

    @Override
    public void initialize(IsDate constraintAnnotation) {
        this.constraintAnnotation = constraintAnnotation;
    }

    @Override
    public boolean isValid(String value, ConstraintValidatorContext context) {
        try {
            if(value == null) return true;
            LocalDate.parse(value, formatter);
            return true;
        }
        catch (Exception ex) {
            throw new RuntimeException(ex);
        }
    }
}