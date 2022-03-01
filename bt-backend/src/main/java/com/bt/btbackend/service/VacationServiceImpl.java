package com.bt.btbackend.service;

import com.bt.btbackend.model.Tour;
import com.bt.btbackend.model.VacationDay;
import com.bt.btbackend.repository.AbstractBaseRepositoryImpl;
import com.bt.btbackend.repository.TourRepository;
import com.bt.btbackend.repository.VacationRepository;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;

@Service
@Transactional
public class VacationServiceImpl extends AbstractBaseRepositoryImpl<VacationDay, Long>{
    private VacationRepository myDomainRepository;

    public VacationServiceImpl(VacationRepository myDomainRepository) {
        super(myDomainRepository);
    }

    // other specialized methods from the MyDomainService interface


}
