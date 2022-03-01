package com.bt.btbackend.model;


import com.bt.btbackend.validation.annotation.IsDate;
import com.bt.btbackend.validation.annotation.IsHourMinute;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

@Entity
@Table(name = "tour")
@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class Tour extends AbstractBaseEntity {

    @NotBlank
    @IsDate
    private String date;

    @NotBlank
    @IsHourMinute
    private String departure;
    @NotBlank
    @IsHourMinute
    private String arrival;
    @NotBlank
    private String vehicle;

    @NotNull
    private double cbm;
    @NotNull
    private long kmDeparture;
    @NotNull
    private long kmArrival;
    @NotNull
    private long deliveryNr;

    @NotBlank
    private String driver;
    @NotBlank
    private String buildingSite;
    @NotBlank
    private String workPlant;

    @IsHourMinute
    private String dischargeBegin;
    @IsHourMinute
    private String dischargeEnd;

    private String dischargeType;
    private int waitTime;
    private String other;
}