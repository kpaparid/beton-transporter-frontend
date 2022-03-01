package com.bt.btbackend.api;

import com.bt.btbackend.model.Tour;
//import com.bt.btbackend.utils.SearchCriteria;
import com.bt.btbackend.security.roles.IsAdmin;
import com.bt.btbackend.security.roles.IsAdminPlus;
import com.bt.btbackend.security.roles.IsUserPlus;
import com.bt.btbackend.service.TourServiceImpl;
import com.bt.btbackend.service.TourServiceImpl2;
import com.bt.btbackend.utils.ResponseHandler;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("tours")
public class ToursController {

    private final TourServiceImpl tourService;
    private final TourServiceImpl2 tourService2;

    @Autowired
    ToursController(TourServiceImpl tourService, TourServiceImpl2 tourService2) {
        this.tourService = tourService;
        this.tourService2 = tourService2;
    }

    @IsUserPlus
    @PutMapping()
    ResponseEntity<Object> addMany(@Valid @RequestBody List<Tour> newEntries) {
        try {
            tourService.saveAll(newEntries);
            return ResponseHandler.generateResponse("Successfully saved data!", HttpStatus.OK, null);
        } catch (Exception e) {
            return ResponseHandler.generateResponse(e.getMessage(), HttpStatus.MULTI_STATUS, null);
        }
    }

    @IsUserPlus
    @GetMapping("/{ids}")
    ResponseEntity<Object> getId(@PathVariable Long[] ids) {
        try {
            HashMap<String, List<Tour>> hm = new HashMap<>();
            hm.put("content", tourService.findByIds(ids));
            return ResponseHandler.generateResponse("Successfully loaded IDs!", HttpStatus.OK, hm);
        } catch (Exception e) {
            return ResponseHandler.generateResponse(e.getMessage(), HttpStatus.MULTI_STATUS, null);
        }

    }

    @IsUserPlus
    @DeleteMapping("/{ids}")
    ResponseEntity<Object> deleteIds(@PathVariable Long[] ids) {
        try {
            tourService.deleteAllById(ids);
            return ResponseHandler.generateResponse("Successfully deleted data!", HttpStatus.OK, null);
        } catch (Exception e) {
            return ResponseHandler.generateResponse(e.getMessage(), HttpStatus.MULTI_STATUS, null);
        }
    }

    @IsUserPlus
    @GetMapping()
    public ResponseEntity<Object> findAllBySpecification(@RequestParam Map<String, String> search, Pageable pageable) {
        try {
            return ResponseHandler.generateResponse("Successfully saved data!", HttpStatus.OK, tourService.findAllBySpecification(search, pageable));
        } catch (Exception e) {
            return ResponseHandler.generateResponse(e.getMessage(), HttpStatus.MULTI_STATUS, null);
        }
    }
    @IsAdminPlus
    @GetMapping("/cbm")
    public ResponseEntity<Object> getCbm(@RequestParam String date) {
        try {
            return ResponseHandler.generateResponse("Successfully saved data!", HttpStatus.OK, tourService2.findCbm(date));
        } catch (Exception e) {
            return ResponseHandler.generateResponse(e.getMessage(), HttpStatus.MULTI_STATUS, null);
        }
    }

    @IsAdminPlus
    @GetMapping("/sales")
    public ResponseEntity<Object> getSales(@RequestParam String date) {
        try {
            return ResponseHandler.generateResponse("Successfully saved data!", HttpStatus.OK, tourService2.findSales(date));
        } catch (Exception e) {
            return ResponseHandler.generateResponse(e.getMessage(), HttpStatus.MULTI_STATUS, null);
        }
    }
    @IsAdminPlus
    @GetMapping("/cbm-year/")
    public ResponseEntity<Object> getYearSales(@RequestParam String date) {
        try {
            return ResponseHandler.generateResponse("Successfully saved data!", HttpStatus.OK, tourService2.findYearCbm(date));
        } catch (Exception e) {
            return ResponseHandler.generateResponse(e.getMessage(), HttpStatus.MULTI_STATUS, null);
        }
    }
    @IsAdminPlus
    @GetMapping("/cbm-by-work-plant")
    public ResponseEntity<Object> findSalesByWorkPlant(@RequestParam String date) {
        try {
            return ResponseHandler.generateResponse("Successfully saved data!", HttpStatus.OK, tourService2.findCbmByAllWorkPlants(date));
        } catch (Exception e) {
            return ResponseHandler.generateResponse(e.getMessage(), HttpStatus.MULTI_STATUS, null);
        }
    }


}
