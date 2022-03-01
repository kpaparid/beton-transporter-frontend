package com.bt.btbackend.model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.annotation.Nullable;
import javax.persistence.Entity;
import javax.persistence.Table;

@Entity
@Table(name = "publicHoliday")
@NoArgsConstructor
@AllArgsConstructor
@Setter
@Getter
public class PublicHoliday extends AbstractBaseEntity {
    String date;
    String localName;
    String name;
    String countryCode;
    String counties;

    public void setCounties(String[] counties) {
        if (counties == null) this.counties= "";
        else this.counties= String.join(",", counties);
    }
    public void setDate(String date) {
        this.date = date.replaceAll("-",".");
    }
}
