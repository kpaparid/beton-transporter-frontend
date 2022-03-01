package com.bt.btbackend.api;

import com.bt.btbackend.model.AbsentDay;
import com.bt.btbackend.model.Tour;
import com.bt.btbackend.model.WorkHourBank;
import com.bt.btbackend.security.roles.IsAdmin;
import com.bt.btbackend.security.roles.IsAdminPlus;
import com.bt.btbackend.security.roles.IsUserPlus;
import com.bt.btbackend.service.AbsentDayServiceImpl;
import com.bt.btbackend.utils.ResponseHandler;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.support.PagedListHolder;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.*;

@RestController
@RequestMapping("absent-days")
public class AbsentDayController {

    private final AbsentDayServiceImpl service;

    @Autowired
    AbsentDayController(AbsentDayServiceImpl service) {
        this.service = service;
    }


    @Scheduled(cron = "0 0 0 * * ?")
    public void scheduleFixedDelayTask() {
        service.declineOldPendingVacations();
    }


    @IsUserPlus
    @PutMapping()
    ResponseEntity<Object> addMany(@Valid @RequestBody List<AbsentDay> array) {
        try {
            service.saveAll(array);
            return ResponseHandler.generateResponse("Successfully saved data!", HttpStatus.OK, null);
        } catch (Exception e) {
            return ResponseHandler.generateResponse(e.getMessage(), HttpStatus.MULTI_STATUS, null);
        }
    }

    @IsUserPlus
    @GetMapping("/{ids}")
    ResponseEntity<Object> getId(@PathVariable Long[] ids) {
        try {
            HashMap<String, List<AbsentDay>> hm = new HashMap<>();
            hm.put("content", service.findByIds(ids));
            return ResponseHandler.generateResponse("Successfully loaded IDs!", HttpStatus.OK, hm);
        } catch (Exception e) {
            return ResponseHandler.generateResponse(e.getMessage(), HttpStatus.MULTI_STATUS, null);
        }

    }

    @IsUserPlus
    @DeleteMapping("/{ids}")
    ResponseEntity<Object> deleteIds(@PathVariable Long[] ids) {
        try {
            service.deleteAllById(ids);
            return ResponseHandler.generateResponse("Successfully deleted IDs!", HttpStatus.OK, null);
        } catch (Exception e) {
            return ResponseHandler.generateResponse(e.getMessage(), HttpStatus.MULTI_STATUS, null);
        }
    }

    @IsUserPlus
    @GetMapping()
    public ResponseEntity<Object> findAllBySpecification(@RequestParam Map<String, String> search, Pageable pageable) {

        try {
            Page<AbsentDay> data = service.findAllBySpecification(search, pageable);
            return ResponseHandler.generateResponse("Successfully loaded data!", HttpStatus.OK, data);
        } catch (Exception e) {
            return ResponseHandler.generateResponse(e.getMessage(), HttpStatus.MULTI_STATUS, null);
        }
    }

    @IsUserPlus
    @GetMapping("vacations/rest")
    public ResponseEntity<Object> findBank(
            @RequestParam(name = "date") int year,
            @RequestParam(name = "driver") String driver
    ) {
        try {
            HashMap<String, Integer> count = service.findVacations(driver, year);
            return ResponseHandler.generateResponse("Successfully loaded data!", HttpStatus.OK, count);
        } catch (Exception e) {
            return ResponseHandler.generateResponse(e.getMessage(), HttpStatus.MULTI_STATUS, null);
        }
    }

    @IsUserPlus
    @GetMapping("vacations/active")
    public ResponseEntity<Object> findActiveVacations() {
        try {
            return ResponseHandler
                    .generateResponse("Successfully loaded data!", HttpStatus.OK, service.findActiveVacations());
        } catch (Exception e) {
            return ResponseHandler.generateResponse(e.getMessage(), HttpStatus.MULTI_STATUS, null);
        }
    }

    @IsAdminPlus
    @GetMapping("vacations/upcoming")
    public ResponseEntity<Object> findUpcomingVacations() {
        try {
            return ResponseHandler
                    .generateResponse("Successfully loaded data!", HttpStatus.OK, service.findUpcomingVacations());
        } catch (Exception e) {
            return ResponseHandler.generateResponse(e.getMessage(), HttpStatus.MULTI_STATUS, null);
        }
    }

    //    @IsAdmin
    @IsUserPlus
    @GetMapping("vacations/active-upcoming")
    public ResponseEntity<Object> findActiveAndUpcomingVacations(Pageable pageable) {
        try {
            List<AbsentDay> list = service.findActiveAndUpcomingVacations();
            if (pageable.getSort().isSorted()) {
                if (pageable.getSort().getOrderFor("dateFrom") != null) {
                    if (pageable.getSort().getOrderFor("dateFrom").isAscending()) {
                        list.sort(Comparator.comparing(AbsentDay::getDateFrom).reversed());
                    } else {
                        list.sort(Comparator.comparing(AbsentDay::getDateFrom));
                    }
                } else if (pageable.getSort().getOrderFor("dateTo") != null) {
                    if (pageable.getSort().getOrderFor("dateTo").isAscending()) {
                        list.sort(Comparator.comparing(AbsentDay::getDateTo).reversed());
                    } else {
                        list.sort(Comparator.comparing(AbsentDay::getDateTo));
                    }
                } else if (pageable.getSort().getOrderFor("driver") != null) {
                    if (pageable.getSort().getOrderFor("driver").isAscending()) {
                        list.sort(Comparator.comparing(AbsentDay::getDriver).reversed());
                    } else {
                        list.sort(Comparator.comparing(AbsentDay::getDriver));
                    }
                }
            }
            PagedListHolder<AbsentDay> page = new PagedListHolder<>(list);
            page.setPageSize(pageable.getPageSize());
            page.setPage(pageable.getPageNumber());
            PageImpl<AbsentDay> pageImpl = new PageImpl<>(page.getPageList(), pageable, list.size());
            return ResponseHandler
                    .generateResponse("Successfully loaded data!", HttpStatus.OK, pageImpl);
        } catch (Exception e) {
            return ResponseHandler.generateResponse(e.getMessage(), HttpStatus.MULTI_STATUS, null);
        }
    }


}
