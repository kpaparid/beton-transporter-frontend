package com.bt.btbackend.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class WorkHourBankByDateDriver {
    String uid;
    String driver;
    int hours;

}
