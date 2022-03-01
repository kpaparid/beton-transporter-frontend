package com.bt.btbackend.utils;

import com.bt.btbackend.model.WorkHourBank;
import lombok.NoArgsConstructor;
import org.springframework.beans.support.PagedListHolder;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.Comparator;
import java.util.List;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

@NoArgsConstructor
public final class Utils {

    public static void validateYear(String date) {
        final Pattern pattern = Pattern.compile("(19|20)[0-9][0-9]");
        if (!pattern.matcher(date).matches()) {
            throw new IllegalArgumentException("Invalid Date");
        }
    }

    public static void validateYearMonth(String date) {
        final Pattern pattern = Pattern.compile("((?:19|20)[0-9][0-9]).(0[1-9]|1[012])");
        if (!pattern.matcher(date).matches()) {
            throw new IllegalArgumentException("Invalid Date");
        }
    }

    public static List<LocalDate> getThisDateDays(String begin, String end) {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy.MM.dd");
        LocalDate startDate = LocalDate.parse(begin, formatter);
        LocalDate endDate = LocalDate.parse(end, formatter).plusDays(1);

        return startDate.datesUntil(endDate).collect(Collectors.toList()).stream().filter(d -> {
            String weekDay = d.getDayOfWeek().toString();
            return !weekDay.equals("SATURDAY") && !weekDay.equals("SUNDAY") && d.getMonth().equals(startDate.getMonth());
        }).collect(Collectors.toList());
    }
}
