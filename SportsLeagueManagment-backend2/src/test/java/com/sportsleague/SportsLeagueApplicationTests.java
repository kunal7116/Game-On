package com.sportsleague;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

@SpringBootTest(classes = SportsLeagueApplication.class)
@ActiveProfiles("test")
class SportsLeagueApplicationTests {

	@Test
	void contextLoads() {
		// Verifies the Spring application context starts without errors.
	}

}
