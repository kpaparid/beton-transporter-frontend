package com.bt.btbackend.api;

import com.bt.btbackend.model.*;
import com.bt.btbackend.security.SecurityService;
import com.bt.btbackend.security.roles.IsAdmin;
import com.bt.btbackend.security.roles.IsAdminPlus;
import com.bt.btbackend.service.AbsentDayServiceImpl;
import com.bt.btbackend.service.WorkHoursBankServiceImpl;
import com.bt.btbackend.service.WorkHoursServiceImpl;
import com.bt.btbackend.utils.ResponseHandler;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.support.PagedListHolder;
import org.springframework.data.domain.*;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.Month;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("work-hours-bank")
public class WorkHoursBankController {


    private final WorkHoursBankServiceImpl service;


    @Autowired
    WorkHoursBankController(WorkHoursBankServiceImpl service ) {
        this.service = service;
    }

    @IsAdminPlus
    @GetMapping("/by-date-driver")
    public ResponseEntity<Object> findByDateDriver(@RequestParam String date, Pageable pageable) {
        try {
            List<WorkHourBankByDateDriver> list = service.findByDateDriver(date);
            if (pageable.getSort().isSorted()) {
                if (pageable.getSort().getOrderFor("driver") != null) {
                    if (pageable.getSort().getOrderFor("driver").isAscending()) {
                        list.sort(Comparator.comparing(WorkHourBankByDateDriver::getDriver).reversed());
                    } else {
                        list.sort(Comparator.comparing(WorkHourBankByDateDriver::getDriver));
                    }
                } else if (pageable.getSort().getOrderFor("hours") != null) {
                    if (pageable.getSort().getOrderFor("hours").isAscending()) {
                        list.sort(Comparator.comparing(WorkHourBankByDateDriver::getHours).reversed());
                    } else {
                        list.sort(Comparator.comparing(WorkHourBankByDateDriver::getHours));
                    }
                }
            }
            PagedListHolder<WorkHourBankByDateDriver> page = new PagedListHolder<>(list);
            page.setPageSize(pageable.getPageSize());
            page.setPage(pageable.getPageNumber());
            PageImpl<WorkHourBankByDateDriver> pageImpl = new PageImpl<>(page.getPageList(), pageable, list.size());
            return ResponseHandler.generateResponse("Successfully loaded data!", HttpStatus.OK, pageImpl);
        } catch (Exception e) {
            return ResponseHandler.generateResponse(e.getMessage(), HttpStatus.MULTI_STATUS, null);
        }
    }

    @IsAdminPlus
    @GetMapping()
    public ResponseEntity<Object> findBank(
            @RequestParam(name = "date") int date,
            @RequestParam(name = "driver") String driver,
            Pageable pageable) {
        try {
            List<WorkHourBank> list = service.findBank(date, driver);
            if (pageable.getSort().isSorted()) {
                if (pageable.getSort().getOrderFor("date") != null) {
                    if (pageable.getSort().getOrderFor("date").isAscending()) {
                        list.sort(Comparator.comparing(WorkHourBank::getDate).reversed());
                    } else {
                        list.sort(Comparator.comparing(WorkHourBank::getDate));
                    }
                } else if (pageable.getSort().getOrderFor("hours") != null) {
                    if (pageable.getSort().getOrderFor("hours").isAscending()) {
                        list.sort(Comparator.comparing(WorkHourBank::getHours).reversed());
                    } else {
                        list.sort(Comparator.comparing(WorkHourBank::getHours));
                    }
                }
            }
            PagedListHolder<WorkHourBank> page = new PagedListHolder<>(list);
            page.setPageSize(pageable.getPageSize());
            page.setPage(pageable.getPageNumber());
            PageImpl<WorkHourBank> pageImpl = new PageImpl<>(page.getPageList(), pageable, list.size());
            return ResponseHandler.generateResponse("Successfully loaded IDs!", HttpStatus.OK, pageImpl);
        } catch (Exception e) {
            return ResponseHandler.generateResponse(e.getMessage(), HttpStatus.MULTI_STATUS, null);
        }

    }

}