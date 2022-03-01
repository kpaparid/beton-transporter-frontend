package com.bt.btbackend.model;

import com.bt.btbackend.validation.annotation.IsDate;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.Duration;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.Date;
import java.util.List;
import java.util.Locale;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;

@Entity
@Table(name = "absentDay")
@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class AbsentDay extends AbstractBaseEntity {
    @NotBlank
    private String driver;

    @NotBlank
    @IsDate
    private String dateTo;

    @NotBlank
    @IsDate
    private String dateFrom;

    @NotBlank
    private String reason;

    private long days;

    private int verified;

    public void setDateTo(String dateTo){
        this.dateTo = dateTo;
        this.days = calcDays();
    }
    public void setDateFrom(String dateFrom){
        this.dateFrom = dateFrom;
        this.days = calcDays();
    }
    public void setDays(int days){
        this.days = calcDays();
    }


    public long calcDays() {
        String begin = this.dateFrom;
        String end = this.dateTo;
        if(begin!=null && end!=null){
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy.MM.dd");
            LocalDate startDate = LocalDate.parse(begin,formatter);
            LocalDate endDate = LocalDate.parse(end,formatter);
            List<LocalDate> c = startDate.datesUntil(endDate).collect(Collectors.toList());
            return startDate.datesUntil(endDate).collect(Collectors.toList()).stream().filter(d -> {
                String weekDay = d.getDayOfWeek().toString();
                return !weekDay.equals("SATURDAY") && !weekDay.equals("SUNDAY");
            }).count() + 1;
        }
        return 0;
    }
}