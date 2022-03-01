package com.bt.btbackend.model;

import com.bt.btbackend.validation.annotation.IsDate;
import com.bt.btbackend.validation.annotation.IsHourMinute;
import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Locale;
import java.util.concurrent.TimeUnit;

@Entity
@Table(name = "workHour")
@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class WorkHour extends AbstractBaseEntity {
    @NotBlank
    @IsDate
    private String date;
    @NotBlank
    private String driver;

    private String duration;
    @NotBlank
    @IsHourMinute
    private String pause;

    @NotBlank
    @IsHourMinute
    private String begin;
    @NotBlank
    @IsHourMinute
    private String end;


    public void setBegin(String begin){
        this.begin = begin;
        this.duration = calcDuration();
    }
    public void setEnd(String end){
        this.end = end;
        this.duration = calcDuration();
    }
    public void setDuration(String end){
//        this.duration = calcDuration();
    }

    public String calcDuration(){
        String begin = this.getBegin();
        String end = this.getEnd();
        if(begin!=null && end!=null){
            SimpleDateFormat sdf = new SimpleDateFormat("HH:mm", Locale.ENGLISH);
            Date firstDate;
            Date secondDate;
            try {
                firstDate = sdf.parse(begin);
                secondDate = sdf.parse(end);
                long diffInMillies = secondDate.getTime() - firstDate.getTime();
                long diff = TimeUnit.MINUTES.convert(diffInMillies, TimeUnit.MILLISECONDS);
                int hours = (int) (diff/60);
                int minutes = (int) (diff%60);
                return String.format("%03d", hours) +":" + String.format("%02d", minutes) ;
            } catch (ParseException e) {
                return  this.duration;
            }
        }
        return  this.duration;
    }
    private void setDuration(){}
}
