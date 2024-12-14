package itmo.localpiper.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import itmo.localpiper.backend.model.House;
import itmo.localpiper.backend.model.User;
import itmo.localpiper.backend.model.UserHouseRel;

@Repository
public interface UserHouseRelRepository extends CrudRepository<UserHouseRel, Long>{
    @Override
    List<UserHouseRel> findAll();

    @Query("SELECT uhr.house FROM UserHouseRel uhr WHERE uhr.user.id = :userId AND uhr.isResident = true")
    List<House> findAllHousesWhereUserIsResident(@Param("userId") Long userId);

    @Query("SELECT uhr.house FROM UserHouseRel uhr WHERE uhr.user.id = :userId")
    List<House> findAllHousesByUser(@Param("userId") Long userId);

    @Query("SELECT uhr.user FROM UserHouseRel uhr WHERE uhr.house.id = :houseId AND uhr.isResident = true")
    List<User> findAllUsersWhereUserIsResident(@Param("houseId") Long houseId);
    
    @Query("SELECT uhr.user FROM UserHouseRel uhr WHERE uhr.house.id = :houseId")
    List<User> findAllUsersByHouse(@Param("houseId") Long houseId);

}
