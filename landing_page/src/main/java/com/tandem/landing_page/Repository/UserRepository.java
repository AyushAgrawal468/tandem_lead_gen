package com.tandem.landing_page.Repository;
import com.tandem.landing_page.Entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User,Long>
{

}
