package com.bt.btbackend.api;

import com.bt.btbackend.model.Tour;
import com.bt.btbackend.security.SecurityService;
import com.bt.btbackend.service.TourServiceImpl;
import com.bt.btbackend.service.TourServiceImpl2;
import com.bt.btbackend.utils.ResponseHandler;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;

import javax.sql.DataSource;
import java.sql.SQLException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("public")
public class PublicController {


    @Autowired
    private SecurityService securityService;

    @GetMapping()
    ResponseEntity<Object> getConnection() {
        try {
            securityService.getUser();
            return ResponseHandler.generateResponse("Connected", HttpStatus.OK, null);
        } catch (Exception e) {
            return ResponseHandler.generateResponse("Connected", HttpStatus.MULTI_STATUS, null);

        }
    }


}
