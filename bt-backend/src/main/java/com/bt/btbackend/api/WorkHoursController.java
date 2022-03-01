package com.bt.btbackend.api;

import com.bt.btbackend.model.PublicHoliday;
import com.bt.btbackend.model.WorkHour;
import com.bt.btbackend.security.roles.IsAdmin;
import com.bt.btbackend.security.roles.IsUserPlus;
import com.bt.btbackend.service.PublicHolidaysServiceImpl;
import com.bt.btbackend.service.WorkHoursServiceImpl;
import com.bt.btbackend.utils.ResponseHandler;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("work-hours")
public class WorkHoursController {

    private final WorkHoursServiceImpl workHoursService;

    @Autowired
    WorkHoursController(WorkHoursServiceImpl service) {
        this.workHoursService = service;
    }

    @IsUserPlus
    @PutMapping()
    ResponseEntity<Object> addMany(@Valid @RequestBody List<WorkHour> newEntries) {
        try {
            workHoursService.saveAll(newEntries);
            return ResponseHandler.generateResponse("Successfully saved data!", HttpStatus.OK, null);
        } catch (Exception e) {
            return ResponseHandler.generateResponse(e.getMessage(), HttpStatus.MULTI_STATUS, null);
        }
    }

    @IsUserPlus
    @GetMapping("/{ids}")
    ResponseEntity<Object> getId(@PathVariable Long[] ids) {

        try {
            HashMap<String, List<WorkHour>> hm = new HashMap<>();
            hm.put("content", workHoursService.findByIds(ids));
            return ResponseHandler.generateResponse("Successfully loaded IDs!", HttpStatus.OK, hm);
        } catch (Exception e) {
            return ResponseHandler.generateResponse(e.getMessage(), HttpStatus.MULTI_STATUS, null);
        }

    }

    @IsUserPlus
    @DeleteMapping("/{ids}")
    ResponseEntity<Object> deleteIds(@PathVariable Long[] ids) {
        try {
            workHoursService.deleteAllById(ids);
            return ResponseHandler.generateResponse("Successfully deleted IDs!", HttpStatus.OK, null);
        } catch (Exception e) {
            return ResponseHandler.generateResponse(e.getMessage(), HttpStatus.MULTI_STATUS, null);
        }
    }

    @IsUserPlus
    @GetMapping()
    public ResponseEntity<Object> findAllBySpecification(@RequestParam Map<String, String> search, Pageable pageable) {
        try {
            return ResponseHandler.generateResponse("Successfully loaded data!", HttpStatus.OK, workHoursService.findAllBySpecification(search, pageable));
        } catch (Exception e) {
            return ResponseHandler.generateResponse(e.getMessage(), HttpStatus.MULTI_STATUS, null);
        }
    }


}