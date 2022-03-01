package com.bt.btbackend.model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.Entity;
import javax.persistence.Table;

@Entity
@Table(name = "vacationDay")
@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class VacationDay extends AbstractBaseEntity {
    private String driver;
    private String toDate;
    private String fromDate;
}