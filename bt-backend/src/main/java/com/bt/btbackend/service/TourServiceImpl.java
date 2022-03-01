package com.bt.btbackend.service;

import com.bt.btbackend.model.Cbm;
import com.bt.btbackend.model.Sales;
import com.bt.btbackend.model.SettingsDto;
import com.bt.btbackend.model.Tour;
import com.bt.btbackend.repository.AbstractBaseRepositoryImpl;
import com.bt.btbackend.repository.SettingsRepository;
import com.bt.btbackend.repository.TourRepository;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.HashMap;
import java.util.List;

@Service
@Transactional
public class TourServiceImpl extends AbstractBaseRepositoryImpl<Tour, Long>{
    public TourServiceImpl(TourRepository myDomainRepository) {
        super(myDomainRepository);
    }

}
