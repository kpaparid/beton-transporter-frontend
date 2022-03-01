package com.bt.btbackend.service;

//import com.bt.btbackend.repository.AbsentDayRepository;
import com.bt.btbackend.model.WorkHour;
import com.bt.btbackend.model.WorkHourBank;
import com.bt.btbackend.repository.AbstractBaseRepositoryImpl;
import com.bt.btbackend.repository.WorkHoursRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.Map;

@Service
@Transactional
public class WorkHoursServiceImpl extends AbstractBaseRepositoryImpl<WorkHour, Long>
        implements AbstractBaseService<WorkHour, Long> {
    private WorkHoursRepository workHourRepository;

    public WorkHoursServiceImpl(WorkHoursRepository myDomainRepository) {
        super(myDomainRepository);
    }
}
