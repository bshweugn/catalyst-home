package itmo.localpiper.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import itmo.localpiper.backend.model.TriggerCondition;

@Repository
public interface TriggerConditionRepository extends CrudRepository<TriggerCondition, Long>{
    @Override
    List<TriggerCondition> findAll();

    @Query("""
        SELECT tc FROM TriggerCondition tc 
        LEFT JOIN tc.device d 
        LEFT JOIN d.room r1 
        LEFT JOIN r1.floor f1 
        LEFT JOIN f1.house h1 
        LEFT JOIN tc.camera c 
        LEFT JOIN c.room r2 
        LEFT JOIN r2.floor f2 
        LEFT JOIN f2.house h2 
        WHERE h1.id = :houseId OR h2.id = :houseId
    """)
    List<TriggerCondition> findByHouseId(@Param("houseId") Long houseId); // holy hell, this will load, like, forever
}
