// Story DNA trait pools (Round 24). Hand-written; see docs/WRITING-LIBRARY.md.
const DNA_POOLS = {
  jobs: {
    Drama: ['night nurse', 'ferry pilot', 'debt collector', 'school bus driver', 'hospice cook', 'piano tuner', 'court stenographer', 'dairy farmer', 'union steward', 'funeral director', 'hotel night porter', 'social worker', 'shipyard welder', 'small-town pharmacist', 'tailor', 'lighthouse keeper', 'driving instructor', 'prison librarian', 'home help', 'church organist', 'fishmonger', 'removals man', 'dialysis technician', 'second-hand bookseller'],
    Comedy: ['wedding DJ', 'substitute teacher', 'mall Santa', 'pet psychic', 'driving examiner', 'party clown', 'hotel concierge', 'parking warden', 'cruise ship magician', 'failed motivational speaker', 'karaoke host', 'dog walker', 'tax inspector', 'garden centre manager', 'children\'s entertainer', 'call centre trainee', 'retired stuntman', 'wedding planner', 'ice-cream van driver', 'museum guard', 'lollipop man', 'radio weatherman', 'novelty cake baker', 'bouncy-castle hire man'],
    Crime: ['pawnbroker', 'getaway driver', 'insurance investigator', 'locksmith', 'night-shift detective', 'safecracker', 'customs officer', 'casino pit boss', 'bail bondsman', 'forensic accountant', 'crime reporter', 'car-wash owner', 'parole officer', 'jeweller', 'harbour pilot', 'tow-truck driver', 'loan shark\'s bookkeeper', 'disgraced lawyer', 'evidence-room clerk', 'cab dispatcher', 'art restorer', 'dockworker', 'nightclub cashier', 'retired forger'],
    Thriller: ['air traffic controller', 'hostage negotiator', 'cryptographer', 'embassy translator', 'cybersecurity analyst', 'train conductor', 'witness-protection marshal', 'court interpreter', 'nuclear plant engineer', 'private security driver', 'investigative journalist', 'pharmaceutical chemist', 'hotel switchboard operator', 'mountain rescue medic', 'data clerk', 'bank auditor', 'ship\'s radio officer', 'surveillance van tech', 'polygraph examiner', 'night-shift 911 dispatcher', 'archive researcher', 'commuter-plane pilot', 'courier', 'satellite technician'],
    Horror: ['night-shift caretaker', 'estate clearer', 'hospice chaplain', 'radio host', 'forest ranger', 'mortuary assistant', 'antique dealer', 'sleep researcher', 'babysitter', 'well digger', 'paranormal debunker', 'motel manager', 'taxidermist', 'lighthouse relief keeper', 'demolition surveyor', 'school janitor', 'organ restorer', 'census taker', 'vet on call', 'live-in carer', 'cave guide', 'church bell-ringer', 'doll repairer', 'house-sitter'],
    Action: ['bodyguard', 'stunt driver', 'smokejumper', 'ex-marine bartender', 'bounty hunter', 'helicopter pilot', 'salvage diver', 'motorcycle courier', 'armoured-truck guard', 'oil-rig roughneck', 'demolitions expert', 'border patrol agent', 'freight-train engineer', 'search-and-rescue swimmer', 'bomb disposal tech', 'mercenary turned mechanic', 'repo man', 'ice-road trucker', 'park ranger', 'riot cop', 'cargo pilot', 'firefighter', 'getaway mechanic', 'personal trainer'],
    'Martial arts': ['noodle cook', 'dojo janitor', 'retired champion', 'herbalist', 'bus driver', 'street sweeper', 'monastery gardener', 'calligraphy teacher', 'dock porter', 'bone-setter', 'night watchman', 'restaurant dishwasher', 'stunt double', 'pharmacy delivery boy', 'tea-house waiter', 'bodyguard', 'rickshaw puller', 'masseur', 'fishmonger\'s apprentice', 'travelling acrobat', 'tailor', 'blacksmith', 'school gym teacher', 'kite maker'],
    Western: ['ranch hand', 'telegraph operator', 'stagecoach driver', 'saloon pianist', 'deputy marshal', 'blacksmith', 'horse breaker', 'circuit preacher', 'frontier doctor', 'cattle buyer', 'railroad surveyor', 'trading-post keeper', 'bounty hunter', 'schoolteacher', 'mail rider', 'gold-claim widow', 'undertaker', 'water diviner', 'cavalry scout', 'gunsmith', 'faro dealer', 'sheepherder', 'hotel cook', 'land-office clerk'],
    Romance: ['florist', 'wedding photographer', 'bakery owner', 'translator', 'vineyard hand', 'bookshop owner', 'violin maker', 'tour guide', 'ferry deckhand', 'marine biologist', 'ski instructor', 'radio producer', 'pastry chef', 'architect', 'dog groomer', 'night-school teacher', 'veterinarian', 'museum restorer', 'cartographer', 'speech therapist', 'beekeeper', 'piano teacher', 'travel writer', 'perfumer'],
    Musical: ['chorus dancer', 'lounge singer', 'piano mover', 'theatre usher', 'street busker', 'music teacher', 'diner waitress', 'choir master', 'record-shop clerk', 'cruise-ship singer', 'tap teacher', 'jingle writer', 'stagehand', 'wedding-band drummer', 'ballroom instructor', 'organ grinder', 'piano tuner', 'radio announcer', 'factory girl', 'understudy', 'shoe-shiner', 'lighting operator', 'cabaret host', 'brass-band trumpeter'],
    'Sci-fi': ['ship\'s mechanic', 'terraforming engineer', 'memory archivist', 'cargo hauler', 'xenobiologist', 'colony doctor', 'android repairer', 'orbital traffic controller', 'dream technician', 'asteroid miner', 'clone-bay nurse', 'signal analyst', 'hydroponics farmer', 'time-office clerk', 'salvage pilot', 'weather engineer', 'translator for the visitors', 'quarantine officer', 'lunar tour guide', 'cryosleep attendant', 'data courier', 'reactor tech', 'border-gate inspector', 'archivist of dead languages'],
    Fantasy: ['apprentice cartographer', 'royal food taster', 'dragon-stable hand', 'hedge witch', 'ferryman', 'bell founder', 'tower librarian', 'travelling tinker', 'goose girl', 'disgraced knight', 'castle chimney sweep', 'river pilot', 'potion brewer', 'bard', 'gravedigger', 'beekeeper to the queen', 'map thief', 'lamplighter', 'oracle\'s scribe', 'swordsmith\'s daughter', 'wool dyer', 'border warden', 'pig keeper', 'court jester'],
    War: ['field medic', 'radio operator', 'tank mechanic', 'army cook', 'code breaker', 'chaplain', 'sniper', 'ambulance driver', 'cartographer', 'quartermaster', 'combat engineer', 'war photographer', 'bomber navigator', 'translator', 'resistance courier', 'nurse at the front', 'stretcher bearer', 'submarine sonar operator', 'mule handler', 'censor', 'military bandsman', 'prisoner-camp clerk', 'mine sweeper', 'farm boy conscript'],
    Period: ['lady\'s maid', 'governess', 'mill girl', 'butler', 'country doctor', 'printer\'s apprentice', 'portrait painter', 'coachman', 'mapmaker', 'lacemaker', 'curate', 'chimney sweep', 'music master', 'shipping clerk', 'scullery maid', 'dressmaker', 'poet', 'botanist', 'innkeeper', 'magistrate\'s clerk', 'estate gamekeeper', 'apothecary', 'tutor', 'organ builder'],
    Documentary: ['retired lighthouse keeper', 'teenage chess prodigy', 'last cobbler on the high street', 'night-shift nurse', 'amateur astronomer', 'competitive pigeon fancier', 'small-town mayor', 'wildlife rescuer', 'veteran boxing coach', 'dairy farmer', 'immigrant restaurant owner', 'community radio host', 'grandmother marathon runner', 'shipyard welder', 'teenage climate organiser', 'rural midwife', 'piano tuner', 'whistleblower accountant', 'street food vendor', 'school headteacher', 'prison chess coach', 'beekeeper', 'deep-sea fisherman', 'former child actor'],
    Animation: ['young lighthouse keeper', 'lost toy', 'baker\'s cat', 'robot janitor', 'mouse tailor', 'cloud shepherd', 'junior firefighter', 'snail mail carrier', 'kite-flying girl', 'apprentice wizard', 'zoo night guard', 'little tugboat', 'scarecrow', 'ghost who is afraid of people', 'penguin chef', 'umbrella repairman', 'dragon who can\'t fly', 'bee who hates honey', 'garbage-truck driver', 'puppet maker', 'fox who runs a bakery', 'moon-lamp lighter', 'rubber duck', 'toy soldier'],
    Superhero: ['crime-scene photographer', 'city electrician', 'high-school chemistry teacher', 'night-shift paramedic', 'bike messenger', 'billionaire\'s intern', 'subway mechanic', 'newspaper intern', 'museum guard', 'sanitation worker', 'public defender', 'barista', 'retired hero', 'weather-station tech', 'ER surgeon', 'pizza delivery driver', 'foster kid', 'lab assistant', 'traffic cop', 'radio DJ', 'social worker', 'construction crane operator', 'comic-shop clerk', 'animal-shelter volunteer']
  },
  worlds: {
    Drama: [
      ['the ferry office', 'FERRY OFFICE', 'in a port town where the boats have stopped running'],
      ['the family farmhouse', 'FARMHOUSE KITCHEN', 'on land the bank has already measured for houses'],
      ['the night ward', 'HOSPITAL WARD', 'where the same six patients have been dying slowly all winter'],
      ['the corner laundrette', 'LAUNDRETTE', 'on a high street with more shutters than shops'],
      ['the shipyard canteen', 'SHIPYARD CANTEEN', 'in the last week before the yard closes for good'],
      ['the care home', 'CARE HOME LOUNGE', 'where the television is never switched off'],
      ['the motorway services', 'SERVICE STATION CAFE', 'halfway between two cities nobody chose to live in'],
      ['the flat above the shop', 'FLAT ABOVE THE SHOP', 'in a mining town that lost its mine a generation ago'],
      ['the community pool', 'SWIMMING BATHS', 'that the council votes to close every spring'],
      ['the funeral parlour', 'FUNERAL PARLOUR', 'run by the same family for four generations'],
      ['the allotment shed', 'ALLOTMENT SHED', 'on the edge of an estate that floods every autumn'],
      ['the county courthouse', 'COURTHOUSE CORRIDOR', 'in a town where everyone knows the defendant'],
      ['the bus depot', 'BUS DEPOT', 'where the night drivers wait out the last hour'],
      ['the dairy', 'MILKING PARLOUR', 'in a valley the milk price is slowly emptying'],
      ['the school staffroom', 'STAFFROOM', 'at a comprehensive about to be inspected'],
      ['the boarding house', 'BOARDING HOUSE', 'by a seaside resort that peaked before the war'],
      ['the hospital car park', 'HOSPITAL CAR PARK', 'where families sit in cars because the visiting hours are over'],
      ['the tailor\'s shop', 'TAILOR\'S SHOP', 'on a street where the new flats have no curtains yet'],
      ['the prison library', 'PRISON LIBRARY', 'where the books are older than the inmates'],
      ['the church hall', 'CHURCH HALL', 'that hosts a wedding, a wake and a jumble sale in one week'],
      ['the lighthouse cottage', 'LIGHTHOUSE COTTAGE', 'on an island the supply boat visits twice a month'],
      ['the fish market', 'FISH MARKET', 'before dawn, in a harbour losing its quotas'],
      ['the union office', 'UNION OFFICE', 'above a factory that has just been sold abroad'],
      ['the old cinema', 'DERELICT CINEMA', 'in a market town that is being turned into a commuter suburb']
    ],
    Comedy: [
      ['the wedding venue', 'WEDDING VENUE', 'booked for two weddings on the same Saturday'],
      ['the garden centre', 'GARDEN CENTRE', 'in a commuter village obsessed with its Best Kept award'],
      ['the cruise ship', 'CRUISE SHIP LOUNGE', 'on a budget cruise that has never left the harbour'],
      ['the call centre', 'CALL CENTRE FLOOR', 'where the targets are posted beside the fire exits'],
      ['the holiday camp', 'HOLIDAY CAMP', 'clinging on through its final, rainiest season'],
      ['the driving test centre', 'TEST CENTRE', 'where nobody has passed first time since the roundabout went in'],
      ['the regional TV studio', 'TV STUDIO', 'that broadcasts a morning show to eleven thousand viewers'],
      ['the hotel reception', 'HOTEL RECEPTION', 'during a dentists\' conference and a magicians\' convention'],
      ['the village fete', 'VILLAGE GREEN', 'in a hamlet with a long feud over the marrow contest'],
      ['the dog-grooming salon', 'GROOMING SALON', 'in a suburb that takes its dog shows far too seriously'],
      ['the family restaurant', 'RESTAURANT KITCHEN', 'on the night the food critic is rumoured to visit'],
      ['the open-plan office', 'OPEN-PLAN OFFICE', 'at a company that makes nothing anyone can describe'],
      ['the karaoke bar', 'KARAOKE BAR', 'on a seafront where the rival bar plays louder'],
      ['the retirement village', 'RETIREMENT VILLAGE', 'where the residents run a betting ring on everything'],
      ['the school reunion', 'SCHOOL HALL', 'twenty years after the worst prom in local history'],
      ['the camping site', 'CAMPSITE', 'on the one bank-holiday weekend it did not rain'],
      ['the museum', 'MUSEUM GALLERY', 'whose star exhibit is a stuffed bear in a hat'],
      ['the ice-cream van', 'ICE-CREAM VAN', 'in a turf war over three streets of a seaside town'],
      ['the amateur theatre', 'VILLAGE HALL STAGE', 'staging an ambitious musical with eleven actors'],
      ['the in-laws\' bungalow', 'BUNGALOW LOUNGE', 'for a Christmas nobody can leave because of the snow'],
      ['the wedding marquee', 'MARQUEE', 'pitched on a field the farmer says is his'],
      ['the motorway hotel', 'BUDGET HOTEL CORRIDOR', 'beside a roundabout with seven exits'],
      ['the local radio station', 'RADIO BOOTH', 'that has lost every listener under sixty'],
      ['the party-supply shop', 'PARTY SHOP', 'where every helium balloon in town is sold']
    ],
    Crime: [
      ['the pawnshop', 'PAWNSHOP', 'on a block where everyone owes someone'],
      ['the car wash', 'CAR WASH', 'that washes more money than cars'],
      ['the casino floor', 'CASINO FLOOR', 'in a river town the gambling boats kept alive'],
      ['the evidence room', 'EVIDENCE ROOM', 'in a precinct where things go missing on Fridays'],
      ['the docks', 'CONTAINER DOCK', 'where the cranes run all night and nobody checks the manifests'],
      ['the diner', 'ALL-NIGHT DINER', 'where the same three booths are always reserved'],
      ['the jeweller\'s workshop', 'JEWELLER\'S WORKSHOP', 'in a diamond district that closes its shutters at five'],
      ['the cab office', 'CAB OFFICE', 'whose drivers see everything and say nothing'],
      ['the motel', 'ROADSIDE MOTEL', 'off a highway the smugglers use as a back road'],
      ['the nightclub', 'NIGHTCLUB OFFICE', 'owned on paper by a dentist from out of town'],
      ['the scrapyard', 'SCRAPYARD', 'where cars come in whole and leave in pieces'],
      ['the precinct', 'PRECINCT BULLPEN', 'in a city halfway through an election'],
      ['the boxing gym', 'BOXING GYM', 'that launders a little and trains a lot'],
      ['the racetrack', 'RACETRACK STABLES', 'where the favourite keeps losing by a nose'],
      ['the fish restaurant', 'RESTAURANT BACK ROOM', 'whose back room sees more business than the dining room'],
      ['the auction house', 'AUCTION HOUSE', 'selling the estate of a man who died owing everyone'],
      ['the harbour bar', 'HARBOUR BAR', 'in a fishing port that has stopped fishing'],
      ['the bail office', 'BAIL OFFICE', 'across the road from a courthouse that never sleeps'],
      ['the parking garage', 'PARKING GARAGE', 'under a bank that is about to be robbed'],
      ['the prison visiting room', 'VISITING ROOM', 'where deals are made across a plastic table'],
      ['the laundromat', 'LAUNDROMAT', 'that is the only cash business on the block still open'],
      ['the art gallery', 'GALLERY BACK ROOM', 'whose most valuable painting hangs in the storeroom'],
      ['the truck stop', 'TRUCK STOP', 'on a border crossing with a bored customs post'],
      ['the coroner\'s office', 'CORONER\'S OFFICE', 'in a county with a suspicious number of accidents']
    ],
    Thriller: [
      ['the control tower', 'CONTROL TOWER', 'at a regional airport during a fog that will not lift'],
      ['the night train', 'SLEEPER CARRIAGE', 'crossing a border at three in the morning'],
      ['the embassy', 'EMBASSY CORRIDOR', 'in a capital where the power keeps failing'],
      ['the data centre', 'SERVER HALL', 'buried under a hillside and humming like a hive'],
      ['the switchboard', 'HOTEL SWITCHBOARD', 'in a grand hotel hosting a summit it will not name'],
      ['the reactor plant', 'REACTOR CONTROL ROOM', 'on a coast where the storm has cut the roads'],
      ['the newsroom', 'NEWSROOM', 'at a paper with one week left before it is sold'],
      ['the dispatch centre', 'DISPATCH CENTRE', 'where every call is recorded and one is missing'],
      ['the safe house', 'SAFE HOUSE', 'in a suburb where every lawn looks the same'],
      ['the research lab', 'RESEARCH LAB', 'funded by a company with no listed address'],
      ['the mountain hut', 'MOUNTAIN HUT', 'cut off by an avalanche with seven strangers inside'],
      ['the cargo ship', 'SHIP\'S RADIO ROOM', 'three days from any port'],
      ['the archive', 'ARCHIVE STACKS', 'beneath a ministry that pretends it was never built'],
      ['the surveillance van', 'SURVEILLANCE VAN', 'parked outside the same house for nine days'],
      ['the hospital', 'HOSPITAL CORRIDOR', 'where a protected witness is recovering under a false name'],
      ['the conference hotel', 'HOTEL SUITE', 'during the week a trade deal is signed'],
      ['the commuter plane', 'COCKPIT', 'on a short hop that has gone very quiet'],
      ['the bank vault', 'BANK VAULT', 'in a city where the bank holiday has emptied the streets'],
      ['the ferry', 'CAR DECK', 'on a crossing that should take two hours and has taken five'],
      ['the satellite station', 'SATELLITE STATION', 'on a frozen plateau with a broken radio'],
      ['the courthouse', 'JUDGE\'S CHAMBERS', 'on the morning of the verdict'],
      ['the polygraph room', 'INTERVIEW ROOM', 'in a government building with no windows'],
      ['the parking structure', 'PARKING STRUCTURE', 'where the cameras have been off since Tuesday'],
      ['the island resort', 'RESORT VILLA', 'out of season, with the last boat already gone']
    ],
    Horror: [
      ['the empty school', 'SCHOOL CORRIDOR', 'over the summer, when the bells still ring at nine'],
      ['the farmhouse', 'FARMHOUSE CELLAR', 'at the end of a lane the satnav refuses to find'],
      ['the care home', 'CARE HOME', 'where one resident has outlived every member of staff'],
      ['the motel', 'MOTEL ROOM', 'whose sign has said VACANCY for forty years'],
      ['the radio station', 'RADIO BOOTH', 'broadcasting to a valley that has stopped calling in'],
      ['the mortuary', 'MORTUARY', 'in a hospital basement where the lift stops on its own'],
      ['the forest cabin', 'FOREST CABIN', 'deep in woods where the birds go quiet at dusk'],
      ['the lighthouse', 'LIGHTHOUSE LAMP ROOM', 'on a rock where the keepers kept leaving logs and not themselves'],
      ['the estate house', 'STAIRCASE', 'full of a dead woman\'s belongings and her clocks'],
      ['the caravan park', 'CARAVAN', 'out of season, with one caravan still lit'],
      ['the church', 'BELL TOWER', 'in a village whose bells ring on no schedule'],
      ['the sleep clinic', 'SLEEP LAB', 'where the patients all dream the same hallway'],
      ['the cave', 'CAVE PASSAGE', 'that the guides never take tourists past the second chamber'],
      ['the new-build estate', 'SHOW HOME', 'built on a field the old maps leave blank'],
      ['the doll hospital', 'DOLL WORKSHOP', 'where repairs are never collected'],
      ['the hotel', 'HOTEL CORRIDOR', 'closed for the winter with a caretaker and his family'],
      ['the well', 'WELL HOUSE', 'in a drought village that will not drink from it'],
      ['the hospice', 'HOSPICE ROOM', 'where the night chaplain hears the patients\' last requests'],
      ['the island', 'ISLAND JETTY', 'whose population has been eighty-one for two hundred years'],
      ['the taxidermy shop', 'TAXIDERMY SHOP', 'on a high street where nobody walks after dark'],
      ['the organ loft', 'ORGAN LOFT', 'in a chapel where the organ plays when the doors are locked'],
      ['the basement flat', 'BASEMENT FLAT', 'rented cheap because no tenant stays a month'],
      ['the hunting lodge', 'HUNTING LODGE', 'whose trophies are all of animals nobody can name'],
      ['the abandoned mall', 'MALL ATRIUM', 'where the escalators still run']
    ],
    Action: [
      ['the oil rig', 'OIL RIG DECK', 'in the North Sea with a storm forty minutes out'],
      ['the freight yard', 'FREIGHT YARD', 'where a train full of something nobody will name is waiting'],
      ['the dam', 'DAM CONTROL ROOM', 'above a valley town of twelve thousand'],
      ['the cargo plane', 'CARGO HOLD', 'flying low over mountains with no radio'],
      ['the skyscraper', 'SKYSCRAPER ATRIUM', 'on the night its owner throws a launch party'],
      ['the border crossing', 'BORDER CHECKPOINT', 'where the road runs out and the desert starts'],
      ['the fire station', 'FIRE STATION', 'in a canyon town during the worst fire season on record'],
      ['the ice road', 'TRUCK CAB', 'on a frozen lake that is starting to crack'],
      ['the container port', 'CONTAINER STACKS', 'where the cranes have been taken over'],
      ['the motor speedway', 'PIT LANE', 'on the day of a race that is a cover for something else'],
      ['the mountain pass', 'MOUNTAIN ROAD', 'the only way out of a valley being sealed off'],
      ['the armoured truck', 'ARMOURED TRUCK', 'on its last run before the company changes routes'],
      ['the salvage ship', 'SALVAGE SHIP', 'over a wreck that three governments want'],
      ['the convention centre', 'CONVENTION HALL', 'hosting an arms fair under another name'],
      ['the subway', 'SUBWAY TUNNEL', 'during a citywide blackout'],
      ['the jungle airstrip', 'AIRSTRIP', 'where the fuel is running out and the rain is not'],
      ['the high-rise prison', 'PRISON BLOCK', 'twelve floors up with the lifts cut'],
      ['the cruise liner', 'ENGINE ROOM', 'in open water with two thousand guests asleep'],
      ['the logging camp', 'LOGGING CAMP', 'in a forest the wildfire is closing on'],
      ['the hydro plant', 'TURBINE HALL', 'that powers half the coast'],
      ['the gym', 'BOXING GYM', 'in the neighbourhood the cartel is buying up'],
      ['the cable car', 'CABLE CAR', 'stalled halfway up a glacier'],
      ['the motorway', 'MOTORWAY', 'at rush hour, every lane jammed'],
      ['the military base', 'HANGAR', 'decommissioned, but not as empty as the papers say']
    ],
    'Martial arts': [
      ['the noodle shop', 'NOODLE SHOP', 'in a harbour district run by three rival schools'],
      ['the dojo', 'DOJO', 'that the developers want for a car park'],
      ['the monastery', 'MONASTERY COURTYARD', 'on a mountain where the pilgrims have stopped coming'],
      ['the tea house', 'TEA HOUSE', 'where the gangs settle their disputes over cups that must not spill'],
      ['the docks', 'DOCKSIDE WAREHOUSE', 'where a fight club meets under the fish crates'],
      ['the herbal pharmacy', 'HERBAL PHARMACY', 'whose drawers hold cures and poisons side by side'],
      ['the rooftops', 'ROOFTOPS', 'of an old city where the alleys are too narrow for cars'],
      ['the bamboo forest', 'BAMBOO FOREST', 'at the edge of a province ruled by a single family'],
      ['the boxing ring', 'UNDERGROUND RING', 'beneath a nightclub where fights are fixed by the minute'],
      ['the walled village', 'VILLAGE GATE', 'that owes protection money to the river bandits'],
      ['the opera troupe', 'OPERA BACKSTAGE', 'whose acrobats are the best fighters in town'],
      ['the tournament hall', 'TOURNAMENT HALL', 'hosting a contest whose winners are never seen again'],
      ['the restaurant kitchen', 'RESTAURANT KITCHEN', 'with eleven cooks and a hundred knives'],
      ['the bus depot', 'BUS DEPOT', 'where the drivers practise forms between shifts'],
      ['the fishing village', 'FISHING VILLAGE', 'where the old master is pretending to be a drunk'],
      ['the prison yard', 'PRISON YARD', 'where the guards bet on the fights'],
      ['the high-rise', 'TOWER BLOCK STAIRWELL', 'twenty-two floors with a gang on every landing'],
      ['the river barge', 'RIVER BARGE', 'carrying silver and three hired swords'],
      ['the temple ruins', 'TEMPLE RUINS', 'where an old style was last taught before it was outlawed'],
      ['the market', 'NIGHT MARKET', 'whose stalls are protected by a family that wants more'],
      ['the circus', 'CIRCUS TENT', 'travelling a province where the warlord loves acrobats'],
      ['the school gym', 'SCHOOL GYM', 'in a suburb where the local club has gone crooked'],
      ['the forge', 'FORGE', 'that makes the last good blades in the province'],
      ['the snowy pass', 'MOUNTAIN PASS', 'where the inn is the only shelter for three days\' walk']
    ],
    Western: [
      ['the trading post', 'TRADING POST', 'on a river crossing the railroad wants'],
      ['the saloon', 'SALOON', 'in a cattle town between drives'],
      ['the ranch', 'RANCH HOUSE', 'in a valley where the water rights are disputed'],
      ['the telegraph office', 'TELEGRAPH OFFICE', 'the last stop before the line ends'],
      ['the stagecoach station', 'WAY STATION', 'in desert country a day from any town'],
      ['the mining camp', 'MINING CAMP', 'where the silver is running out faster than the whisky'],
      ['the jailhouse', 'JAILHOUSE', 'holding a prisoner his brothers are riding to free'],
      ['the church', 'FRONTIER CHURCH', 'in a town that has not had a preacher in two years'],
      ['the railroad camp', 'RAILROAD CAMP', 'at the end of the track, laying a mile a day'],
      ['the homestead', 'SOD HOUSE', 'on prairie the cattlemen say is open range'],
      ['the cavalry fort', 'FORT PARADE GROUND', 'on a frontier the government has forgotten'],
      ['the gold claim', 'CREEK CLAIM', 'that a widow is working alone'],
      ['the livery stable', 'LIVERY STABLE', 'in a town where every horse is spoken for'],
      ['the hotel', 'FRONTIER HOTEL', 'with one good room and a long register'],
      ['the cattle drive', 'TRAIL CAMP', 'two hundred miles from the railhead'],
      ['the border town', 'CANTINA', 'where the marshal\'s writ runs out'],
      ['the land office', 'LAND OFFICE', 'on the morning the territory opens'],
      ['the schoolhouse', 'SCHOOLHOUSE', 'in a town split between farmers and ranchers'],
      ['the sheep camp', 'SHEEP CAMP', 'in hills the cattle baron has fenced'],
      ['the river ferry', 'RIVER FERRY', 'the only crossing for forty miles'],
      ['the undertaker\'s', 'UNDERTAKER\'S PARLOUR', 'in a town that keeps him busy'],
      ['the box canyon', 'BOX CANYON', 'with one way in and the posse at the mouth'],
      ['the water hole', 'WATER HOLE', 'the only one left in a drought summer'],
      ['the boarding house', 'BOARDING HOUSE', 'run by a woman who keeps a shotgun under the counter']
    ],
    Romance: [
      ['the bookshop', 'BOOKSHOP', 'on a cobbled street in a town that floods every spring'],
      ['the vineyard', 'VINEYARD', 'in its first harvest after the old owner died'],
      ['the bakery', 'BAKERY', 'that opens at five for the fishermen'],
      ['the island ferry', 'FERRY DECK', 'on the only route to an island with one pub'],
      ['the ski lodge', 'SKI LODGE', 'snowed in over New Year'],
      ['the flower market', 'FLOWER MARKET', 'before dawn, in a city that sleeps late'],
      ['the wedding', 'WEDDING RECEPTION', 'of the hero\'s former fiancé'],
      ['the radio station', 'RADIO STUDIO', 'that broadcasts a late-night request show'],
      ['the violin workshop', 'VIOLIN WORKSHOP', 'in an old quarter full of music schools'],
      ['the marine station', 'MARINE STATION', 'on a coast where the whales come back each autumn'],
      ['the night school', 'NIGHT-SCHOOL CLASSROOM', 'where adults learn a language for reasons they will not say'],
      ['the coastal hotel', 'HOTEL TERRACE', 'at the end of a summer that has to end'],
      ['the vet\'s surgery', 'VET\'S SURGERY', 'in a farming village with too many dogs'],
      ['the museum', 'RESTORATION STUDIO', 'restoring a painting of two lovers nobody can identify'],
      ['the apartment building', 'SHARED LANDING', 'whose walls are thin enough to hear the piano next door'],
      ['the beehives', 'APIARY', 'on a hillside the two families have shared for decades'],
      ['the train', 'DINING CAR', 'on a long crossing of a whole continent'],
      ['the perfume house', 'PERFUME LAB', 'trying to recreate a scent from a letter'],
      ['the café', 'CORNER CAFE', 'where the same two strangers sit at the same time every day'],
      ['the dance studio', 'DANCE STUDIO', 'teaching a wedding dance to a couple who are not a couple'],
      ['the cartography office', 'MAP ROOM', 'redrawing a coast that keeps eroding'],
      ['the summer camp', 'CAMP LAKE', 'twenty years after the last time they were both there'],
      ['the hospital', 'HOSPITAL ROOF', 'where two night-shift workers take their breaks'],
      ['the lighthouse inn', 'INN DINING ROOM', 'on a headland with one road in']
    ],
    Musical: [
      ['the theatre', 'BACKSTAGE', 'of a show three days from opening and nowhere near ready'],
      ['the diner', 'DINER', 'where the waitresses harmonise on the lunch rush'],
      ['the shipyard', 'SHIPYARD', 'whose brass band is all that keeps the town proud'],
      ['the dance hall', 'DANCE HALL', 'that the owner is about to sell to a car-park company'],
      ['the record shop', 'RECORD SHOP', 'in a neighbourhood with a music scene nobody outside knows'],
      ['the cruise ship', 'SHIP\'S BALLROOM', 'with a resident band that has played the same set for ten years'],
      ['the factory', 'FACTORY FLOOR', 'where the machines keep a rhythm the workers sing to'],
      ['the church', 'CHURCH CHOIR STALLS', 'in a town where the choir competition is war'],
      ['the cabaret', 'CABARET STAGE', 'in a city on the eve of a curfew'],
      ['the summer camp', 'CAMP AMPHITHEATRE', 'that stages one big show every August'],
      ['the high school', 'SCHOOL AUDITORIUM', 'whose music budget has just been cut'],
      ['the boarding house', 'BOARDING HOUSE PARLOUR', 'full of performers between engagements'],
      ['the street corner', 'STREET CORNER', 'in a city neighbourhood about to be rebuilt'],
      ['the ballroom', 'BALLROOM', 'hosting a regional dance championship'],
      ['the jingle studio', 'RECORDING STUDIO', 'that writes thirty-second songs about soap'],
      ['the circus', 'BIG TOP', 'running its last season under canvas'],
      ['the radio station', 'LIVE STUDIO', 'broadcasting a talent contest to three counties'],
      ['the hotel lounge', 'HOTEL PIANO BAR', 'where the pianist knows every guest\'s song'],
      ['the market square', 'MARKET SQUARE', 'on the day of a festival older than the town'],
      ['the shoe-shine stand', 'TRAIN STATION CONCOURSE', 'in a station where every arrival is a chorus'],
      ['the rehearsal room', 'REHEARSAL ROOM', 'above a launderette, rented by the hour'],
      ['the wedding hall', 'WEDDING HALL', 'where two families are trying to out-sing each other'],
      ['the brass-band hut', 'BAND HUT', 'in a colliery village with no colliery left'],
      ['the variety theatre', 'VARIETY STAGE', 'in its final week before the bulldozers']
    ],
    'Sci-fi': [
      ['the orbital station', 'STATION RING', 'whose rotation is slowing a little every day'],
      ['the colony dome', 'COLONY DOME', 'on a moon that the company has stopped answering'],
      ['the cargo hauler', 'CARGO BAY', 'six months from the nearest port'],
      ['the memory clinic', 'MEMORY CLINIC', 'in a city where people sell their memories for rent'],
      ['the terraforming base', 'TERRAFORMING BASE', 'on a planet that is starting to breathe back'],
      ['the cryosleep deck', 'CRYO DECK', 'on a generation ship two centuries into its journey'],
      ['the android repair shop', 'REPAIR SHOP', 'in a district where the machines are not allowed after dark'],
      ['the signal array', 'SIGNAL ARRAY', 'in a desert listening to a message that repeats every eleven minutes'],
      ['the hydroponics farm', 'HYDROPONICS BAY', 'feeding a city under the ice'],
      ['the mining asteroid', 'MINING SHAFT', 'where the drills have found something that was not ore'],
      ['the time office', 'TIME OFFICE', 'that issues permits to revisit one day of your life'],
      ['the quarantine zone', 'QUARANTINE GATE', 'around a town where the visitors landed'],
      ['the lunar hotel', 'LUNAR HOTEL LOBBY', 'struggling through its first bad season'],
      ['the clone bay', 'CLONE BAY', 'in a hospital that grows its own organ donors'],
      ['the weather tower', 'WEATHER CONTROL TOWER', 'that decides whose crops get rain'],
      ['the drowned city', 'FLOODED STREET', 'where the rich live on the top floors'],
      ['the border gate', 'BORDER GATE', 'between the city that sleeps and the city that does not'],
      ['the salvage yard', 'ORBITAL SALVAGE YARD', 'full of ships nobody came back for'],
      ['the research vessel', 'BRIDGE', 'parked at the edge of a gravity anomaly'],
      ['the dream lab', 'DREAM LAB', 'where shared dreams are recorded and sold'],
      ['the arcology', 'ARCOLOGY ATRIUM', 'a city in a single tower that nobody leaves'],
      ['the reactor ring', 'REACTOR RING', 'of a ship whose engineers are all asleep'],
      ['the frozen archive', 'SEED VAULT', 'holding the last samples of a lost Earth'],
      ['the relay station', 'RELAY STATION', 'the last human outpost before the dark']
    ],
    Fantasy: [
      ['the tower library', 'TOWER LIBRARY', 'where the books rewrite themselves when no one is reading'],
      ['the dragon stables', 'DRAGON STABLES', 'beneath a castle whose last dragon is going blind'],
      ['the river crossing', 'FERRY LANDING', 'on a river that carries the dead to the sea'],
      ['the bell foundry', 'BELL FOUNDRY', 'in a kingdom where every bell has a true name'],
      ['the witch\'s cottage', 'COTTAGE KITCHEN', 'at the edge of a forest that moves at night'],
      ['the royal kitchens', 'ROYAL KITCHENS', 'in a palace where the king is poisoned a little every day'],
      ['the map room', 'MAP ROOM', 'whose maps change when borders are broken'],
      ['the mountain monastery', 'MONASTERY', 'that guards a door nobody has opened in a thousand years'],
      ['the market town', 'MARKET SQUARE', 'where a fairy market comes once every seven years'],
      ['the frozen keep', 'KEEP GATEHOUSE', 'on a border wall holding back an endless winter'],
      ['the travelling fair', 'FAIRGROUND WAGONS', 'whose wagons cannot cross running water'],
      ['the drowned bell tower', 'SUNKEN TOWER', 'in a lake that swallowed a city'],
      ['the oracle\'s temple', 'ORACLE\'S TEMPLE', 'where every prophecy has been slightly wrong'],
      ['the goose meadows', 'GOOSE MEADOW', 'below a castle whose princess is not who she says'],
      ['the swordsmith\'s forge', 'FORGE', 'where the blades remember who they have cut'],
      ['the lamplit city', 'LAMPLIT STREET', 'where the lamps keep back what lives in the dark'],
      ['the island of the dead', 'GRAVEYARD ISLAND', 'that the living may visit one night a year'],
      ['the hedge maze', 'HEDGE MAZE', 'that grows a new path for every person who enters'],
      ['the pig farm', 'PIG FARM', 'whose oldest sow can see the future'],
      ['the court of the king', 'THRONE ROOM', 'in a kingdom where lying aloud is a crime'],
      ['the dye works', 'DYE WORKS', 'that makes the only colour the old gods can see'],
      ['the border forest', 'FOREST ROAD', 'where travellers pay the trees a toll'],
      ['the wizard school', 'SCHOOL CLOISTER', 'that has admitted no new students in fifty years'],
      ['the giant\'s bones', 'GIANT\'S RIBCAGE', 'where a village has been built inside a skeleton']
    ],
    War: [
      ['the field hospital', 'FIELD HOSPITAL TENT', 'three miles behind a line that keeps moving'],
      ['the radio hut', 'RADIO HUT', 'on an island garrison that has lost contact'],
      ['the trench', 'TRENCH', 'in the fourth winter of a war meant to be over by Christmas'],
      ['the code-breaking hut', 'CODE ROOM', 'in a country house full of mathematicians and cold tea'],
      ['the bomber airfield', 'AIRFIELD DISPERSAL HUT', 'where the crews count empty chairs at breakfast'],
      ['the occupied village', 'VILLAGE SQUARE', 'where the enemy officer is billeted in the schoolhouse'],
      ['the submarine', 'SUBMARINE CONTROL ROOM', 'lying silent on the seabed above a minefield'],
      ['the prisoner camp', 'CAMP BARRACKS', 'where the clerk knows every man\'s number'],
      ['the cookhouse', 'FIELD KITCHEN', 'feeding a battalion on rations meant for half'],
      ['the river bridge', 'RIVER BRIDGE', 'that must be held for one more day'],
      ['the mountain pass', 'MOUNTAIN OUTPOST', 'manned by eleven men and a mule'],
      ['the ambulance column', 'AMBULANCE CAB', 'on a road the enemy shells every night at nine'],
      ['the censor\'s office', 'CENSOR\'S OFFICE', 'reading other people\'s letters home'],
      ['the city under siege', 'CELLAR SHELTER', 'in a city into its second year of siege'],
      ['the troop ship', 'TROOPSHIP HOLD', 'crossing an ocean full of submarines'],
      ['the minefield', 'MINEFIELD', 'that the farmers need cleared before spring'],
      ['the tank workshop', 'TANK WORKSHOP', 'patching machines to send them back out'],
      ['the resistance safe house', 'ATTIC', 'above a bakery in an occupied town'],
      ['the jungle outpost', 'JUNGLE CLEARING', 'where the war ended months ago and nobody has told them'],
      ['the hospital train', 'HOSPITAL TRAIN', 'running wounded back from the front'],
      ['the requisitioned manor', 'MANOR DRAWING ROOM', 'turned into a staff headquarters'],
      ['the beach', 'LANDING BEACH', 'in the hour before dawn'],
      ['the army band hut', 'BAND HUT', 'whose musicians double as stretcher bearers'],
      ['the farm behind the lines', 'FARMYARD', 'where a family waits for news of three sons']
    ],
    Period: [
      ['the country house', 'COUNTRY HOUSE DRAWING ROOM', 'in the season the estate must be sold or married off'],
      ['the cotton mill', 'MILL FLOOR', 'in a northern town where the looms never stop'],
      ['the servants\' hall', 'SERVANTS\' HALL', 'beneath a family that is quietly bankrupt'],
      ['the printing shop', 'PRINTING SHOP', 'printing pamphlets the magistrate wants burned'],
      ['the vicarage', 'VICARAGE PARLOUR', 'in a parish with more scandal than parishioners'],
      ['the painter\'s studio', 'PAINTER\'S STUDIO', 'in a city where women may not exhibit'],
      ['the coaching inn', 'COACHING INN', 'on the great road north, where secrets change horses'],
      ['the dressmaker\'s', 'DRESSMAKER\'S SHOP', 'sewing gowns for a ball she cannot attend'],
      ['the botanical garden', 'GLASSHOUSE', 'where an expedition\'s seeds are finally sprouting'],
      ['the shipping office', 'COUNTING HOUSE', 'whose ships are three months overdue'],
      ['the asylum', 'ASYLUM WARD', 'where inconvenient wives are sent'],
      ['the assembly rooms', 'ASSEMBLY ROOMS', 'in a spa town during the marriage season'],
      ['the lace workshop', 'LACE WORKSHOP', 'where the children\'s eyes give out by twelve'],
      ['the magistrate\'s court', 'MAGISTRATE\'S COURT', 'in a market town ruled by one landowner'],
      ['the gamekeeper\'s cottage', 'GAMEKEEPER\'S COTTAGE', 'on an estate where poaching is a hanging offence'],
      ['the apothecary', 'APOTHECARY', 'in a city with cholera in the water'],
      ['the music room', 'MUSIC ROOM', 'where a daughter is taught to play and forbidden to compose'],
      ['the organ loft', 'ORGAN LOFT', 'in a cathedral town during the building of a new organ'],
      ['the convent school', 'CONVENT SCHOOL', 'on a cliff above a smugglers\' cove'],
      ['the theatre royal', 'THEATRE ROYAL BACKSTAGE', 'in an age when actresses are not respectable'],
      ['the whaling port', 'WHARF', 'where the widows walk the cliff path every evening'],
      ['the debtors\' prison', 'DEBTORS\' PRISON', 'where whole families live in a single cell'],
      ['the observatory', 'OBSERVATORY', 'whose astronomer has found a comet he cannot afford to name'],
      ['the hunting lodge', 'HUNTING LODGE', 'in the highlands, during a wedding party\'s shooting week']
    ],
    Documentary: [
      ['the lighthouse', 'LIGHTHOUSE', 'decommissioned last year, still kept clean by its last keeper'],
      ['the chess club', 'CHESS CLUB', 'above a betting shop in a city suburb'],
      ['the cobbler\'s shop', 'COBBLER\'S SHOP', 'on a high street where it is the last shop that repairs anything'],
      ['the night ward', 'HOSPITAL WARD', 'over twelve nights of one winter'],
      ['the observatory shed', 'BACK-GARDEN OBSERVATORY', 'in a town with too many streetlights'],
      ['the pigeon loft', 'PIGEON LOFT', 'during the season\'s longest race'],
      ['the town hall', 'TOWN HALL', 'in a town of four hundred people and one bypass'],
      ['the wildlife sanctuary', 'ANIMAL SANCTUARY', 'run from a farmhouse on borrowed money'],
      ['the boxing gym', 'BOXING GYM', 'that has produced one champion in fifty years'],
      ['the family restaurant', 'RESTAURANT KITCHEN', 'in its last year before the lease runs out'],
      ['the community radio station', 'RADIO STUDIO', 'broadcasting from a converted shipping container'],
      ['the marathon route', 'COUNTRY ROAD', 'where a seventy-eight-year-old trains every dawn'],
      ['the shipyard', 'SHIPYARD', 'building its final ship'],
      ['the school hall', 'SCHOOL HALL', 'where students are organising a protest the council ignores'],
      ['the rural clinic', 'MIDWIFE\'S CAR', 'covering a valley the size of a small country'],
      ['the whistleblower\'s kitchen', 'KITCHEN TABLE', 'piled with the documents that ended a career'],
      ['the street-food stall', 'FOOD STALL', 'that feeds a whole night market'],
      ['the primary school', 'HEADTEACHER\'S OFFICE', 'in a school that came bottom of every table and refused to close'],
      ['the prison chess room', 'PRISON CLASSROOM', 'where a chess team prepares for a tournament it cannot travel to'],
      ['the apiary', 'APIARY', 'on a hillside where the bees have been dying'],
      ['the trawler', 'TRAWLER DECK', 'in winter seas, on a boat that should have been retired'],
      ['the former child star\'s flat', 'FLAT', 'full of memorabilia from a show nobody remembers'],
      ['the piano workshop', 'PIANO WORKSHOP', 'restoring the instruments of a closed concert hall'],
      ['the flooded village', 'FLOODED STREET', 'six months after the river came through']
    ],
    Animation: [
      ['the toy shop', 'TOY SHOP', 'where the toys come alive after closing time'],
      ['the cloud farm', 'CLOUD FARM', 'high above a town that has forgotten how to look up'],
      ['the bakery', 'BAKERY', 'run by a fox in a village of suspicious hens'],
      ['the lighthouse', 'LIGHTHOUSE', 'on a rock where the seagulls run the post office'],
      ['the junkyard', 'JUNKYARD', 'where broken robots build themselves a town'],
      ['the snail post office', 'POST OFFICE', 'where every letter arrives exactly a year late'],
      ['the zoo', 'ZOO AT NIGHT', 'whose animals hold a meeting every full moon'],
      ['the tugboat harbour', 'HARBOUR', 'full of boats bigger and louder than our hero'],
      ['the moon workshop', 'MOON WORKSHOP', 'where the stars are polished before each night'],
      ['the wizard academy', 'ACADEMY HALL', 'for very small wizards'],
      ['the attic', 'ATTIC', 'where the forgotten toys have built a kingdom'],
      ['the garden', 'VEGETABLE GARDEN', 'where the vegetables are at war with the slugs'],
      ['the umbrella shop', 'UMBRELLA SHOP', 'in a city where it has stopped raining'],
      ['the haunted house', 'HAUNTED HOUSE', 'where the ghosts are terrified of the new family'],
      ['the penguin restaurant', 'RESTAURANT', 'on an iceberg drifting towards warmer water'],
      ['the fire station', 'FIRE STATION', 'in a town made entirely of paper'],
      ['the puppet theatre', 'PUPPET THEATRE', 'whose puppets want to cut their strings'],
      ['the beehive', 'BEEHIVE', 'where the queen has gone missing'],
      ['the dragon mountain', 'DRAGON MOUNTAIN', 'where every dragon can fly except one'],
      ['the bathtub', 'BATHTUB SEA', 'an ocean as far as a rubber duck can see'],
      ['the scarecrow field', 'CORNFIELD', 'where the crows and the scarecrow have a secret treaty'],
      ['the garbage depot', 'GARBAGE DEPOT', 'in a city that throws away anything a little bit broken'],
      ['the toy-soldier fort', 'TOY FORT', 'on a bedroom shelf above a dangerous carpet'],
      ['the kite festival', 'HILLTOP', 'where the wind has gone missing on festival day']
    ],
    Superhero: [
      ['the newsroom', 'NEWSROOM', 'at a tabloid that sells photos of the masked vigilante'],
      ['the subway', 'SUBWAY PLATFORM', 'in a city where the heroes have unionised'],
      ['the chemistry lab', 'SCHOOL CHEMISTRY LAB', 'where the accident happened'],
      ['the power plant', 'POWER PLANT', 'that gave half the neighbourhood strange abilities'],
      ['the hero headquarters', 'HEADQUARTERS ATRIUM', 'owned by a corporation with a brand to protect'],
      ['the hospital', 'EMERGENCY ROOM', 'that treats the people the heroes miss'],
      ['the rooftops', 'ROOFTOP', 'above a district the police have stopped patrolling'],
      ['the research campus', 'RESEARCH CAMPUS', 'where the city\'s richest man makes his weapons'],
      ['the comic shop', 'COMIC SHOP', 'in a city where the comics are about real people'],
      ['the animal shelter', 'ANIMAL SHELTER', 'where one of the strays is not a dog'],
      ['the bridge', 'SUSPENSION BRIDGE', 'that has been destroyed and rebuilt four times'],
      ['the courtroom', 'COURTROOM', 'where a hero is being sued for property damage'],
      ['the high school', 'HIGH SCHOOL', 'in a suburb where three students have just developed powers'],
      ['the weather station', 'WEATHER STATION', 'that has started making the weather'],
      ['the prison for the powered', 'SUPERMAX CELL BLOCK', 'built under a lake'],
      ['the pizza place', 'PIZZA KITCHEN', 'whose delivery driver is never on time for a reason'],
      ['the crane yard', 'CONSTRUCTION SITE', 'building the tower the villain wants to fall'],
      ['the radio station', 'RADIO BOOTH', 'that broadcasts police scanners all night'],
      ['the retirement home', 'RETIREMENT HOME', 'for heroes who outlived their enemies'],
      ['the museum', 'MUSEUM OF HEROES', 'whose exhibits are starting to go missing'],
      ['the foster home', 'FOSTER HOME', 'in a neighbourhood flattened in the last big fight'],
      ['the city hall', 'MAYOR\'S OFFICE', 'in an election year when the heroes are the main issue'],
      ['the sewer', 'SEWER JUNCTION', 'where the city\'s rejected experiments live'],
      ['the orbital tower', 'SPACE ELEVATOR', 'whose cable is the only thing holding up the sky']
    ]
  },
  foes: {
    Drama: [
      ['the developer buying the street', 'wants the block empty by spring'], ['the older brother who stayed', 'wants the inheritance split his way'], ['the hospital administrator', 'wants the ward closed before the budget review'], ['the father who left', 'wants to be forgiven without saying sorry'], ['the bank manager', 'wants the farm signed over by Friday'], ['the ex-husband', 'wants custody and the dog'], ['the new headteacher', 'wants the old staff gone by Easter'], ['the council planner', 'wants the pool turned into flats'], ['the landlord', 'wants the shop back for his nephew'], ['the mother who never visits', 'wants the house sold while she can still sign'], ['the factory\'s new owner', 'wants the union broken before the contract renews'], ['the best friend who got out', 'wants the hero to admit staying was a mistake'], ['the insurance assessor', 'wants the fire ruled deliberate'], ['the prosecutor from the city', 'wants a conviction to take home']
    ],
    Comedy: [
      ['the rival wedding planner', 'wants the same venue on the same day'], ['the perfect neighbour', 'wants the hero\'s hedge cut to regulation height'], ['the new regional manager', 'wants everyone to do a team-building weekend'], ['the mother-in-law', 'wants the wedding moved to her church'], ['the smug ex', 'wants to be invited to everything and ruin it'], ['the health inspector', 'wants one more reason to close the kitchen'], ['the village committee chair', 'wants the fete run exactly as in 1987'], ['the rival ice-cream man', 'wants the school-gate pitch'], ['the boss\'s nephew', 'wants the hero\'s job and has no idea what it is'], ['the influencer', 'wants the hotel comped for a review nobody reads'], ['the driving examiner', 'wants a perfect parallel park or nothing'], ['the hotel inspector', 'wants the fourth star taken off the sign'], ['the dog-show judge', 'wants the hero\'s dog disqualified on a technicality'], ['the karaoke champion', 'wants to keep the title for an eleventh year']
    ],
    Crime: [
      ['the loan shark', 'wants the debt paid in a way that is not money'], ['the crooked captain', 'wants the case closed before anyone reads the file'], ['the casino owner', 'wants the hero to lose the right hand on the right night'], ['the fixer from out of town', 'wants the witness found before the trial'], ['the partner who turned', 'wants the missing half of the score'], ['the councilman', 'wants the docks rezoned and the bodies kept quiet'], ['the gang boss\'s son', 'wants to prove he is harder than his father'], ['the insurance fraudster', 'wants the fire to look like an accident'], ['the defence lawyer', 'wants the evidence ruled inadmissible'], ['the jeweller\'s silent partner', 'wants the stones moved before the audit'], ['the retired hitman', 'wants one last job to pay for his wife\'s care'], ['the federal agent', 'wants the hero as an informant whatever it costs'], ['the car-wash owner', 'wants the books to stay unread'], ['the widow', 'wants the hero to find the killer and not the money']
    ],
    Thriller: [
      ['the head of station', 'wants the leak plugged and the hero blamed'], ['the man on the phone', 'wants the plane to land somewhere else'], ['the company\'s fixer', 'wants the trial data to disappear'], ['the handler', 'wants the hero to keep going one week longer'], ['the minister\'s aide', 'wants the story spiked before the vote'], ['the stranger on the train', 'wants what is in the hero\'s bag'], ['the protected witness', 'wants out of the deal tonight'], ['the security contractor', 'wants the town evacuated for reasons he will not give'], ['the hacker', 'wants the hero to read a file and then be blamed for it'], ['the hotel manager', 'wants the summit to go smoothly whatever happens upstairs'], ['the sleeper agent', 'wants the hero to trust him one more day'], ['the doctor', 'wants the patient kept unconscious until Friday'], ['the arms broker', 'wants the satellite feed turned off for nine minutes'], ['the colleague who vanished', 'wants the hero to follow the trail he left']
    ],
    Horror: [
      ['the thing in the cellar', 'wants to be let up the stairs'], ['the landlady', 'wants a new tenant every month for a reason'], ['the old man at the end of the lane', 'wants the house kept in the family'], ['the child who will not speak', 'wants the hero to stay the night'], ['the village elders', 'want the hero to take the old keeper\'s place'], ['the voice on the radio', 'wants the hero to say its name on air'], ['the dead woman\'s clocks', 'want the hero to wind them before midnight'], ['the doctor at the sleep clinic', 'wants one more night of data'], ['the husband who came back', 'wants to sleep in his own bed again'], ['the twins next door', 'want a new playmate'], ['the thing in the woods', 'wants the cabin door left open'], ['the congregation', 'wants the bells rung the old way'], ['the house itself', 'wants to be lived in, forever'], ['the previous tenant', 'wants his room back']
    ],
    Action: [
      ['the mercenary commander', 'wants the dam\'s gates opened at dawn'], ['the hijacker', 'wants a plane and a pilot who will not argue'], ['the arms dealer', 'wants the train\'s cargo before it crosses the border'], ['the corrupt general', 'wants the base wiped off the map'], ['the cartel enforcer', 'wants the witness and the hero\'s family'], ['the former teammate', 'wants revenge for the mission the hero walked away from'], ['the tech billionaire', 'wants the city\'s power grid for one night'], ['the hitwoman', 'wants the bounty before the hero collects it'], ['the warden', 'wants the riot to cover a murder'], ['the smuggler captain', 'wants the salvage and no witnesses'], ['the rogue agent', 'wants the drive the hero swallowed'], ['the arsonist', 'wants the canyon to burn with the evidence'], ['the racing team owner', 'wants the race won by any means'], ['the ex-cop', 'wants the armoured truck and its driver']
    ],
    'Martial arts': [
      ['the rival school\'s master', 'wants the hero\'s school to bow or burn'], ['the gangster with a taste for fighters', 'wants the hero in his ring'], ['the warlord', 'wants the old style banned and its teachers gone'], ['the former classmate', 'wants to prove the master chose wrong'], ['the tournament organiser', 'wants the hero to lose in the final round'], ['the developer', 'wants the dojo for a car park'], ['the foreign champion', 'wants to beat every school in the city'], ['the corrupt police chief', 'wants protection money from the noodle shops'], ['the poisoner', 'wants the herbalist\'s recipe book'], ['the bandit chief', 'wants the village\'s harvest every year'], ['the blind swordsman', 'wants to test himself against the hero\'s teacher'], ['the opera troupe\'s patron', 'wants the acrobats to fight for him'], ['the master\'s son', 'wants the school and has none of the patience'], ['the prison guard', 'wants a champion to bet on']
    ],
    Western: [
      ['the cattle baron', 'wants the water and the creek it runs from'], ['the railroad agent', 'wants the homestead land for the new line'], ['the outlaw\'s brother', 'wants the prisoner freed before the judge arrives'], ['the crooked sheriff', 'wants the town quiet and the payments regular'], ['the claim jumper', 'wants the widow\'s gold'], ['the bounty hunter', 'wants the hero\'s head for a price nobody posted'], ['the saloon owner', 'wants the new preacher gone'], ['the land speculator', 'wants every title in the valley'], ['the cavalry colonel', 'wants a battle to get his promotion'], ['the gunfighter', 'wants to know if the hero is faster'], ['the mine owner', 'wants the strike broken by Sunday'], ['the stagecoach robber', 'wants the strongbox and one passenger'], ['the old partner', 'wants his share of the money they buried'], ['the hanging judge', 'wants a hanging before the election']
    ],
    Romance: [
      ['the fiancé', 'wants the wedding to happen on the date already printed'], ['the ex who came back', 'wants a second chance at the worst time'], ['the meddling mother', 'wants a suitable match and a big church'], ['the business rival', 'wants the bakery\'s corner and the love interest\'s attention'], ['the best friend', 'wants the hero to stay single and available'], ['the career', 'wants the hero in another city by September'], ['the love interest\'s daughter', 'wants her parent to herself'], ['the hotel heir', 'wants to buy the bookshop and the building'], ['the jealous colleague', 'wants the promotion and will use the secret'], ['the grandfather', 'wants the feud between the families kept alive'], ['the matchmaker', 'wants the hero paired with someone sensible'], ['the old flame\'s spouse', 'wants the past left alone'], ['the developer', 'wants the vineyard for holiday homes'], ['the hero\'s own pride', 'wants to never be the one who calls first']
    ],
    Musical: [
      ['the producer', 'wants the show recast with a star'], ['the dance-hall buyer', 'wants the building and none of the music'], ['the rival choir master', 'wants the regional trophy for the ninth year'], ['the stern father', 'wants the hero in the family business, not on a stage'], ['the leading lady', 'wants the understudy kept well away from the spotlight'], ['the factory manager', 'wants the singing on the floor to stop'], ['the critic', 'wants the show to close on opening night'], ['the principal', 'wants the music department gone by June'], ['the record label man', 'wants the song and not the singer'], ['the bandleader', 'wants the hero to play the same set forever'], ['the landlord', 'wants the rehearsal room for storage'], ['the censor', 'wants the cabaret closed before the curfew'], ['the champion dancer', 'wants the partner back'], ['the hero\'s stage fright', 'wants the hero safe in the wings']
    ],
    'Sci-fi': [
      ['the company director', 'wants the colony\'s data and not the colonists'], ['the ship\'s computer', 'wants the mission completed whatever the crew wants'], ['the memory broker', 'wants the hero\'s best day for a client'], ['the station administrator', 'wants the slowdown kept secret'], ['the quarantine general', 'wants the town sealed and forgotten'], ['the clone who woke up', 'wants the original\'s life'], ['the time inspector', 'wants the hero\'s permit revoked and the day restored'], ['the mining foreman', 'wants the drilling to continue past the thing they found'], ['the visitor ambassador', 'wants a translation that is not quite true'], ['the weather board', 'wants the rain sold to the highest bidder'], ['the android rights crusader', 'wants the repair shop shut as a slaughterhouse'], ['the captain\'s successor', 'wants the crew woken early to vote'], ['the salvage cartel', 'wants the ghost ship and its last log'], ['the hero\'s future self', 'wants one thing done differently']
    ],
    Fantasy: [
      ['the regent', 'wants the young king to stay a child'], ['the witch of the high wood', 'wants the hero\'s true name'], ['the fairy lord', 'wants a debt paid that the hero\'s grandmother owed'], ['the court wizard', 'wants the dragon dead and its heart for himself'], ['the oracle', 'wants her last prophecy to come true at any cost'], ['the false princess', 'wants to keep the crown she stole'], ['the knight commander', 'wants the border wall held with the hero\'s village on the wrong side'], ['the ferryman of the dead', 'wants a passenger who is not dead yet'], ['the bell founder\'s rival', 'wants the great bell to crack at its first ring'], ['the forest', 'wants its toll'], ['the sorcerer in the tower', 'wants the library\'s last unwritten book'], ['the giant\'s ghost', 'wants his bones back'], ['the queen\'s taster', 'wants the queen to die a little faster'], ['the winter king', 'wants the wall to fall at midwinter']
    ],
    War: [
      ['the enemy sniper', 'wants the bridge held empty'], ['the commanding officer', 'wants the hill taken for a report'], ['the occupying officer', 'wants names from the village'], ['the informer', 'wants to survive the war on both sides'], ['the deserter', 'wants the hero\'s papers and uniform'], ['the general staff', 'wants the attack to go ahead on schedule'], ['the camp commandant', 'wants the escape tunnel found before the inspection'], ['the black marketeer', 'wants the medical supplies sold, not used'], ['the censor', 'wants the letter rewritten as good news'], ['the sergeant', 'wants the new boy broken or gone'], ['the submarine captain', 'wants the convoy before it reaches port'], ['the collaborator mayor', 'wants the resistance handed over to save the town'], ['the war correspondent', 'wants the photograph that will make his name'], ['the enemy code clerk', 'wants to defect with nothing to give']
    ],
    Period: [
      ['the heir to the estate', 'wants the hero married off and out of the house'], ['the mill owner', 'wants the children working longer hours'], ['the magistrate', 'wants the printing press broken'], ['the eldest son', 'wants the family debts paid with his sister\'s marriage'], ['the housekeeper', 'wants the new maid gone before she learns too much'], ['the society hostess', 'wants the hero ruined before the season ends'], ['the vicar', 'wants the scandal kept out of the parish register'], ['the husband', 'wants the hero committed to the asylum'], ['the academy', 'wants the painting hung under a man\'s name'], ['the creditor', 'wants the family\'s silver by quarter day'], ['the gamekeeper', 'wants the poacher hanged as an example'], ['the cousin from abroad', 'wants the estate under an old will'], ['the patron', 'wants the composer\'s music and her silence'], ['the shipping magnate', 'wants the overdue ships declared lost and insured']
    ],
    Documentary: [
      ['the council', 'wants the lighthouse sold as a holiday let'], ['the property company', 'wants the cobbler\'s lease for a coffee chain'], ['the chess federation', 'wants the prodigy on its national team, on its terms'], ['the supermarket chain', 'wants the market stalls cleared'], ['the former employer', 'wants the whistleblower\'s story discredited'], ['the boxing commission', 'wants the old gym\'s licence pulled'], ['the bank', 'wants the sanctuary\'s loan repaid this year'], ['the education authority', 'wants the failing school merged out of existence'], ['the fishing regulator', 'wants the boat\'s quota halved'], ['the prison governor', 'wants the chess team to stop asking for travel permits'], ['the river authority', 'wants the village to accept that it will flood again'], ['the pesticide company', 'wants the bee study kept out of the papers'], ['the old studio', 'wants the child star to sign away the archive'], ['the developer', 'wants the shipyard\'s waterfront for apartments']
    ],
    Animation: [
      ['the grumpy toymaker', 'wants every toy that moves put back in its box'], ['the big loud tugboat', 'wants the harbour to himself'], ['the slug general', 'wants the whole vegetable patch'], ['the hen council', 'wants the fox bakery shut down'], ['the scrapyard magnet', 'wants every robot crushed into a cube'], ['the cat next door', 'wants the mouse tailor for supper'], ['the storm', 'wants the kite festival ruined'], ['the new family', 'wants the house without the ghosts'], ['the circus owner', 'wants the dragon who cannot fly as a sideshow'], ['the head penguin', 'wants the iceberg steered south'], ['the vacuum cleaner', 'wants the lost toys swept up'], ['the puppet master', 'wants every string kept tight'], ['the crow king', 'wants the treaty broken and the corn'], ['the city mayor', 'wants anything broken thrown away']
    ],
    Superhero: [
      ['the billionaire inventor', 'wants the city to need him instead of the heroes'], ['the mayor', 'wants the vigilante unmasked before the election'], ['the hero\'s former mentor', 'wants the old team back on his terms'], ['the mad scientist', 'wants the accident repeated on a larger scale'], ['the tabloid editor', 'wants the hero\'s secret identity on the front page'], ['the alien envoy', 'wants Earth\'s heroes handed over'], ['the corporate brand manager', 'wants the hero to wear the logo'], ['the government agency', 'wants every powered person registered'], ['the villain who is right', 'wants the neighbourhood the heroes keep flattening rebuilt'], ['the rival hero', 'wants the credit for every save'], ['the experiment escaped from the sewers', 'wants its maker to pay'], ['the weather witch', 'wants the city to know a winter that never ends'], ['the hero\'s clone', 'wants to be the real one'], ['the prison warden', 'wants to break the villains and sell what he learns']
    ]
  },
  allies: [
    'a sister who never left town', 'a retired detective who still keeps notebooks', 'a teenage neighbour with a scanner', 'an ex-wife who still answers the phone', 'a priest who lost his faith and kept the job', 'a cab driver who knows every back road', 'a deaf mechanic who reads lips across a room', 'a widow who runs the corner shop', 'a junior doctor on her third night shift', 'a grandfather who was a sailor', 'a librarian with a key to the basement', 'a former rival with nothing left to lose', 'a cook who feeds everyone for free', 'a stray dog that will not leave', 'a schoolfriend who became a lawyer', 'a night porter who sees everyone come and go', 'a translator who hears more than she says', 'a son who has stopped calling', 'a landlady who never asks for the rent on time', 'a hacker who works from a nursing home', 'a choir mistress with a temper', 'a farmer who owes the hero a favour', 'a nurse who used to be a soldier', 'a ten-year-old who notices everything', 'a bartender who keeps a ledger of secrets', 'a ferryman who carries anyone for a story', 'an old flame who married someone sensible', 'a mechanic who can fix anything but her own car', 'a gravedigger with a dry sense of humour', 'a journalist one story from retirement', 'a cousin fresh off the boat', 'a bookmaker who knows the odds on everything', 'a half-blind piano tuner', 'a beekeeper who reads the weather', 'a former student who became famous', 'a security guard who sleeps on the job and dreams useful things', 'a radio ham who talks to the whole world at night', 'a locksmith with a criminal record', 'a deliveryman who has been inside every house in town', 'a twin who is nothing like the hero', 'a doctor struck off for kindness', 'a boxing coach with a bad knee', 'a seamstress who can tell where any cloth was bought', 'a pilot grounded for one bad landing', 'a teacher who still marks the hero\'s letters', 'a cleaner with keys to every office in the building', 'a fisherman who knows the tides to the minute', 'a parole officer who believes in second chances', 'a magician who can spot a lie in the hands', 'a stepmother nobody gave a chance'
  ],
  wants: {
    family: ['get the farm back', 'win one argument with {his} mother', 'bring {his} brother home for Christmas', 'keep the family restaurant open one more year', 'find out who {his} real father was', 'get custody of {his} daughter', 'stop {his} sister selling the house', 'make {his} father proud before he forgets {his} name', 'fill every chair at the table for the wedding', 'pay off {his} parents\' debts', 'get the family photographs back from {his} ex', 'scatter {his} mother\'s ashes where she asked', 'keep the twins together in one foster home', 'be invited to {his} son\'s graduation'],
    power: ['win the election', 'run the company {his} father built', 'take over the docks', 'become the youngest person on the board', 'get the casino licence', 'make the council listen for once', 'own every building on the street', 'get the corner office before {he} turns forty', 'control who gets the water', 'replace the old boss', 'sit on the throne for one day', 'have the last word in every room', 'break the union', 'get {his} name on the building'],
    love: ['win back the one who left', 'say it before the wedding', 'get a second date', 'marry before the visa runs out', 'make the long-distance thing work', 'be chosen, for once', 'find the stranger from the night train', 'keep the marriage alive through the bad year', 'get the love interest to stay one more summer', 'win the dance contest with the right partner', 'be loved for who {he} is now', 'answer the letter {he} never answered', 'take the one who got away to the place they planned', 'move in together before the lease is up'],
    memory: ['remember what happened that night', 'find the house from {his} childhood', 'get the old film restored', 'finish the book {his} mother started', 'keep the town\'s history out of the bulldozer\'s path', 'learn the name of the woman in the photograph', 'hear {his} father\'s voice once more on the old tapes', 'recover the years the accident took', 'hold on to the details before the illness takes them', 'make everyone remember the man they forgot', 'trace the song back to whoever wrote it', 'stand in the place where it happened', 'return the stolen letters to their owners', 'prove {his} memory is right and the records are wrong'],
    identity: ['pass as one of them', 'get {his} real name back on the papers', 'find where {he} was born', 'come out to {his} family at Christmas', 'be taken seriously in the trade', 'win under {his} own name', 'leave the accent behind', 'become the person on {his} passport', 'learn the language {his} grandmother spoke', 'stop being known as somebody\'s child', 'be allowed to wear the uniform', 'be seen without the mask', 'prove {he} belongs in the room', 'get through one day without pretending'],
    justice: ['clear {his} brother\'s name', 'see the factory owner in court', 'get the case reopened', 'make the police admit what they did', 'find the hit-and-run driver', 'get the land back for the village', 'prove the fire was not an accident', 'win the appeal', 'expose the doctor who falsified the results', 'free the man who confessed to save {him}', 'make the company pay for the river', 'get the truth into the paper before the vote', 'make the judge hear the whole story', 'see the cover-up undone'],
    survival: ['get through the winter', 'make it to the border', 'keep the boat afloat until dawn', 'find water before the third day', 'keep the children fed', 'outlast the siege', 'get off the island', 'stay alive until the rescue comes', 'keep the shop open through the recession', 'live long enough to see the baby born', 'stay hidden until the war is over', 'make it down the mountain', 'keep the lights on in the hospital', 'hold the line until morning'],
    faith: ['finish building the church', 'hear from God just once', 'keep the monastery open', 'prove the miracle was real', 'make the pilgrimage before {he} dies', 'be forgiven by the congregation', 'save the parish from closing', 'believe again', 'bring the bell home to the village', 'keep a vow made at fifteen', 'baptise the baby before the fever breaks', 'find the saint\'s missing relic', 'convert the man who hanged {his} father', 'keep the old rites alive'],
    ambition: ['make it to the big stage', 'open {his} own restaurant', 'win the championship', 'get the part', 'publish the novel', 'be the first in the family to finish university', 'beat the record', 'make partner', 'sell out the concert hall', 'build the bridge', 'win the prize that passed {his} father over', 'get into the conservatory', 'design the tallest tower in the city', 'leave the town and never come back'],
    freedom: ['get out of the marriage', 'break out of prison', 'escape the family business', 'cross the border', 'buy back {his} contract', 'leave the cult with {his} sister', 'get {his} passport back', 'quit the job and sail', 'stop owing anyone anything', 'live alone for the first time', 'take the road west with no plan', 'escape the town before {he} becomes {his} father', 'get off the estate and into the city', 'free the horses before the sale'],
    loneliness: ['find one friend in the new town', 'get someone to answer the radio', 'be invited somewhere for Christmas', 'make the neighbours notice {him}', 'join the choir', 'have someone to sit with at the hospital', 'find the pen pal from childhood', 'adopt the dog nobody wants', 'get {his} son to visit', 'dance with someone at the wedding', 'stop eating dinner standing up', 'learn the names of the people on {his} street', 'hear another human voice on the island', 'be missed when {he} is gone'],
    revenge: ['make the man who ruined {his} father pay', 'burn the mill down', 'take the business that took everything', 'find the soldier who gave the order', 'humiliate the ex at the reunion', 'win the case against the firm that fired {him}', 'kill the man who killed {his} brother', 'take the old gang apart piece by piece', 'see the judge disgraced', 'steal back what was stolen', 'beat the champion who crippled {his} teacher', 'ruin the critic\'s career', 'get the sheriff\'s badge off him', 'make the whole town remember what they did']
  },
  needs: {
    family: ['to stop keeping score', 'to let {his} mother be wrong without fixing her', 'to admit {he} left because {he} was afraid', 'to let the house go', 'to be a child again for one evening', 'to forgive the one who stayed', 'to tell {his} father the truth before he forgets it', 'to stop being the one who holds everything together', 'to ask for help with the washing-up', 'to choose the family {he} has over the one {he} lost'],
    power: ['to give the keys to someone else', 'to lose an argument gracefully', 'to see who gets hurt on the way up', 'to be trusted instead of obeyed', 'to admit {he} is frightened of being nobody', 'to walk away from the table', 'to listen to the people in the back row', 'to stop treating kindness as weakness', 'to let the old boss keep his dignity', 'to find out what {he} would do with nothing to win'],
    love: ['to be seen at {his} worst and stay', 'to stop rehearsing the conversation', 'to let the other person leave', 'to say the plain thing plainly', 'to love someone who is not the idea of them', 'to stop testing the people who care', 'to forgive {him}self for the first marriage', 'to stay in the room when it gets hard', 'to want less and give more', 'to accept being chosen second'],
    memory: ['to let the past be finished', 'to learn the version of events {he} left out', 'to grieve instead of preserving', 'to tell the story out loud to someone', 'to stop living in the year it happened', 'to forget one thing on purpose', 'to accept that {he} remembered it wrong', 'to make a new memory in the old place', 'to give the photographs away', 'to forgive the person {he} used to be'],
    identity: ['to stop asking permission to exist', 'to let the old name go', 'to be ordinary for a while', 'to stop performing for the people who left', 'to admit {he} does not know who {he} is yet', 'to take the mask off in front of one person', 'to belong somewhere without earning it', 'to hear {his} own voice without flinching', 'to stop translating {him}self', 'to choose who {he} is instead of inheriting it'],
    justice: ['to accept that some debts are not repaid', 'to stop needing the world to say sorry', 'to see {his} own part in it', 'to choose mercy when it costs something', 'to tell the truth that hurts {his} own side', 'to let the court decide', 'to be fair to the one {he} hates', 'to stop confusing punishment with repair', 'to live well instead of winning', 'to forgive the witness who lied'],
    survival: ['to trust a stranger', 'to rest', 'to want something more than staying alive', 'to share what little {he} has', 'to stop treating every day as the last', 'to let someone else carry the weight', 'to cry once', 'to make a home in the place {he} is hiding', 'to stop counting the supplies at night', 'to believe that tomorrow comes'],
    faith: ['to doubt honestly', 'to find the sacred in the washing-up', 'to forgive God', 'to stop bargaining', 'to let others believe differently', 'to keep the promise without the reward', 'to hear the answer {he} did not want', 'to stop mistaking certainty for faith', 'to pray for the enemy and mean it', 'to accept the silence'],
    ambition: ['to be good instead of famous', 'to enjoy the thing itself', 'to lose and still turn up the next day', 'to thank the people {he} climbed over', 'to stop measuring {him}self against {his} father', 'to make something small and finish it', 'to let a younger rival win', 'to rest before the work breaks {him}', 'to stop waiting for permission', 'to want what {he} already has'],
    freedom: ['to stay and face it', 'to choose a cage {he} likes', 'to stop blaming the place', 'to take someone with {him}', 'to see that the door was never locked', 'to make a promise and keep it', 'to belong to something on purpose', 'to tell the people {he} is leaving why', 'to stop running from the quiet', 'to let others go first'],
    loneliness: ['to be the one who calls first', 'to let someone see the flat', 'to stop pretending {he} likes it this way', 'to say yes to the next invitation', 'to admit {he} pushed them all away', 'to be useful to someone', 'to put the second plate on the table', 'to learn the bus driver\'s name', 'to sit in the café instead of taking it away', 'to be bored with someone else'],
    revenge: ['to stop counting the dead', 'to see the enemy as a person', 'to build something instead of burning it', 'to grieve the one {he} lost', 'to let the law take it', 'to walk away before the last blow', 'to admit the revenge was for {him}self', 'to forgive and not forget', 'to stop letting the dead decide', 'to live long enough to be bored']
  },
  args: {
    family: ['Family is the people who stay for the washing-up.', 'You can love them and still leave.', 'Blood is a starting point, not a contract.', 'The house is not the family.', 'We inherit our parents\' arguments along with their furniture.', 'Every family runs on one unspoken rule.', 'Forgiveness in families is a daily chore, not an event.', 'The child who stays pays for the child who left.', 'Families are rebuilt around whoever is missing.', 'Sometimes the kindest thing is to stop rescuing them.'],
    power: ['Power is a loan, and the interest is other people.', 'Whoever holds the keys decides who is a thief.', 'Every throne is a lonely chair.', 'Power given away grows; power hoarded rots.', 'The powerful are always the last to know.', 'Winning the room means losing the people in it.', 'Nobody takes power; somebody hands it over.', 'The quiet ones are running everything.', 'A crown fits whoever is afraid enough to keep it.', 'Rules are written by people who never expect to break them.'],
    love: ['Love is a decision made every morning.', 'The grand gesture is easier than the small one.', 'You cannot love someone into being someone else.', 'Letting go is also a kind of love.', 'Love arrives at the wrong time on purpose.', 'The one who leaves is not always the one who stopped loving.', 'Love is what is left after the romance.', 'We fall for the person and stay for the habits.', 'Being known is scarier than being alone.', 'Love asks for courage, not perfection.'],
    memory: ['We are what we choose to remember.', 'The past is a story we keep rewriting.', 'Some things are better forgotten, but not by everyone.', 'A place remembers what its people forget.', 'Nostalgia is a liar with a good voice.', 'Memory is the last thing we own.', 'What we forget shapes us as much as what we keep.', 'The dead live in the details.', 'A town without its history is just a postcode.', 'Remembering is an act of love that hurts.'],
    identity: ['A name is something you grow into, not something you are given.', 'We become the masks we wear too long.', 'You are not where you came from; you are what you did there.', 'Belonging is a choice, made on both sides.', 'The self is a rumour we start about ourselves.', 'Nobody is only one thing.', 'Passing is a kind of exile.', 'You can only find yourself by losing the version others need.', 'The accent comes back when you are frightened.', 'Who you are is decided in the small hours, not the speeches.'],
    justice: ['Justice that comes late is still owed.', 'The law and the truth are neighbours who do not speak.', 'Revenge wears justice\'s coat.', 'A fair trial is not the same as a fair world.', 'Truth costs most to the person who tells it.', 'The system works exactly as it was built to.', 'Mercy is justice that has seen the whole story.', 'Every cover-up has a coward and a clerk.', 'One honest witness can outlast a hundred lawyers.', 'The innocent pay interest on other people\'s crimes.'],
    survival: ['Surviving is not the same as living.', 'People share more when they have less.', 'The body wants to live even when the heart does not.', 'Every survivor carries someone who did not make it.', 'Hope is a ration you have to keep handing out.', 'Survival makes strangers into family and family into strangers.', 'The worst of us comes out in comfort, the best in hardship.', 'Staying alive is the first rebellion.', 'Nobody survives alone, whatever they tell you afterwards.', 'You find out what you would do only when you do it.'],
    faith: ['Faith is doubt that keeps showing up.', 'Miracles are mostly people turning up.', 'God is in the arguments, not the answers.', 'A ritual holds you up when belief cannot.', 'A church is only as holy as its soup kitchen.', 'The holy is hidden in the ordinary.', 'Certainty is the enemy of faith.', 'Every prayer is also a confession.', 'Belief is a house you keep repairing.', 'Grace arrives in the shape you did not ask for.'],
    ambition: ['Getting there is lonelier than wanting it.', 'Talent is cheap; turning up is rare.', 'Every summit is somebody else\'s foothill.', 'Ambition is hunger that forgets what it was hungry for.', 'The work is the reward or there is no reward.', 'Success arrives the day after you stop needing it.', 'Climbing means leaving someone below.', 'The prize is never the thing you wanted.', 'Ambition borrowed from your parents is a debt.', 'Second place teaches more than first.'],
    freedom: ['Freedom is choosing your obligations.', 'Every escape takes the escaper along.', 'The cage is sometimes the door.', 'Freedom bought alone is just distance.', 'You are never as free as the day you leave.', 'Freedom is a muscle that weakens if unused.', 'Running away is a direction, not a destination.', 'The road out of town is also the road back.', 'Some prisons are warm and have curtains.', 'Freedom costs someone else something.'],
    loneliness: ['Loneliness is a room with the door left open.', 'You can be lonely in a full house.', 'Connection begins with being a nuisance to someone.', 'Pride keeps more people apart than distance.', 'The lonely are always waiting for the other to call.', 'Solitude chosen is peace; solitude imposed is a sentence.', 'A town can be lonely all at once.', 'Small talk is a lifeline.', 'We are cured of loneliness by being needed.', 'The phone rings for those who ring it.'],
    revenge: ['Revenge is a debt paid in your own blood.', 'The dead do not want what we do in their name.', 'Every revenge creates a new avenger.', 'Getting even means staying level with the worst of them.', 'Revenge is grief with a weapon.', 'The best answer to the man who broke you is a quiet Tuesday.', 'Burning their house warms nobody.', 'The avenger and the villain end up sharing a grave.', 'Revenge keeps the wound open so it can be shown.', 'Justice is for the world; revenge is for the self.']
  },
  flaws: [
    'can\'t ask for help', 'lies when the truth would do', 'never finishes anything', 'drinks alone on Sundays', 'has to be the smartest in the room', 'apologises for everything and means none of it', 'keeps every receipt and every grudge', 'cannot sit still in silence', 'gives away money {he} does not have', 'flirts to avoid being known', 'turns every hurt into a joke', 'trusts nobody under fifty', 'trusts anybody with a sad story', 'cannot say no to {his} mother', 'gambles when {he} is happy', 'goes quiet for days instead of arguing', 'steals small things {he} does not need', 'needs to be needed', 'leaves before {he} can be left', 'reads other people\'s letters', 'is cruel when cornered', 'mistakes rules for morals', 'cannot take a compliment', 'rewrites history in {his} favour', 'cannot stop working', 'avoids doctors', 'drives too fast when upset', 'says yes to everything and turns up to nothing', 'is jealous of {his} friends\' luck', 'hoards food', 'cannot forgive {him}self for anything', 'thinks being right is the same as being good', 'picks fights with strangers', 'hides behind {his} job', 'is always late for the people who matter', 'tells everyone what they want to hear', 'cannot bear to be laughed at', 'loves the idea of people more than the people', 'sulks', 'never admits to being lost', 'keeps a bag packed by the door', 'is vain about {his} hands', 'eavesdrops', 'holds everyone to a standard {he} cannot meet', 'gets bored the moment it gets easy', 'is a snob about small things', 'lets other people take the blame', 'cannot keep a secret', 'keeps far too many secrets', 'thinks money fixes things', 'despises money and is always broke', 'believes in luck more than effort', 'buys loyalty with favours', 'cannot cry in front of anyone', 'cries to win arguments', 'is reckless with other people\'s safety', 'is a coward about phone calls', 'cannot stand being thanked', 'cannot take orders', 'gives orders to people who are not {his} to command', 'pretends not to care', 'cares too loudly', 'makes promises when drunk', 'remembers every slight', 'forgets every birthday', 'tests people until they fail', 'lives in the past tense', 'plans everything and adapts to nothing', 'never plans and calls it freedom', 'collects people who need saving', 'hates {his} own accent', 'is proud of never changing {his} mind', 'fixes other people\'s lives to avoid {his} own', 'performs even when alone', 'takes the long way to avoid one street', 'looks for the exit in every room', 'cannot share credit', 'interrupts', 'believes {he} is a bad person and acts like it', 'keeps score in friendships'
  ],
  wounds: [
    'the night the house burned', 'a promise {he} broke at nineteen', 'the car crash {he} walked away from', 'the year {his} mother did not speak to {him}', 'the brother {he} left at the station', 'being sent away to school at seven', 'the business that went under with {his} name on it', 'a wedding day nobody came to', 'finding {his} father\'s second family', 'the friend {he} did not visit in hospital', 'the drowning at the lake that summer', 'losing the scholarship over one bad exam', 'being the one the newspapers blamed', 'the baby that did not come', 'the soldier {he} could not save', 'the teacher who called {him} stupid in front of everyone', 'the eviction when {he} was ten', 'the fight that ended {his} career', 'a confession {he} signed and did not mean', 'the night {he} hid while the others were taken', 'the letter {he} never posted', 'the dog {he} left behind when they moved', 'the winter {his} father lost the farm', 'a fire {he} started by accident', 'the band that made it after {he} quit', 'being left at the altar', 'the year spent caring for a dying parent', 'a sister who chose the other side', 'the shop robbery {he} was working during', 'being adopted and told by a stranger', 'the stage fright that ended the audition', 'the boat that came back without {his} father', 'losing the house to {his} own gambling', 'a betrayal by the one friend {he} trusted', 'two years in a cell for someone else\'s crime', 'the flood that took the whole street', 'the accident that ended {his} running', 'the night {he} said the thing {he} cannot unsay', 'the divorce that split the family in two', 'the job {he} lost for telling the truth', 'the leaving of {his} home country', 'the funeral {he} missed', 'the son who stopped speaking to {him}', 'being the only survivor of the crash', 'a mother who chose a man over {him}', 'growing up in a house full of shouting', 'the bully who followed {him} home every day', 'the first love who married {his} best friend', 'the riot that took {his} sight in one eye', 'finding the body', 'the operation that went wrong', 'a childhood spent in hotels', 'the illness that kept {him} indoors for a year', 'the photograph that went round the school', 'the father who taught {him} to fight and then left', 'the war {his} grandparents never spoke of', 'the move to a city where nobody spoke {his} language', 'being blamed for the factory closing', 'the sister {he} was told never to mention', 'the race {he} threw for money'
  ],
  losses: [
    '{his} brother', 'the family restaurant', '{his} hearing in one ear', '{his} mother', 'the farm', '{his} first marriage', '{his} daughter', 'the business', '{his} best friend', '{his} sight', '{his} father', 'the house by the sea', '{his} voice', 'the boat', '{his} faith', '{his} husband', '{his} wife', 'the dog', '{his} twin', 'the championship', '{his} career', 'the shop', '{his} teacher', '{his} home country', '{his} son', '{his} grandmother', '{his} right hand', '{his} reputation', 'the band', '{his} sister', 'the scholarship', '{his} partner on the force', 'the old dance hall', '{his} memory of that year', 'the land', '{his} first love', 'the baby', '{his} mentor', 'the family name', '{his} childhood home'
  ],
  incidents: {
    Drama: [
      ['letter', 'A letter arrives at {PLACE} in {LOSS}\'s handwriting, dated last week.'], ['eviction', 'A notice goes up on the door of {PLACE}: thirty days, then the bailiffs.'], ['return', '{A} walks back into {PLACE} after {YEARS} away, carrying one suitcase and {OBJ}.'], ['diagnosis', '{H} is told, in a corridor and not a room, that {he} has a year at most.'], ['will', 'The will is read, and {H} has been left {PLACE} and nothing else.'], ['closure', 'The owners announce that {PLACE} will close at the end of the month.'], ['accident', 'A boy is hurt at {PLACE} on {H}\'s shift, and {R} saw who was looking away.'], ['phone_call', 'At three in the morning a phone call tells {H} that {his} father has walked out of the care home.'], ['custody', '{R} files for custody, and the hearing is in six weeks.'], ['found_object', 'Clearing out a drawer, {H} finds {OBJ}, which should have been buried with {LOSS}.'], ['redundancy', 'The whole staff of {PLACE} is called in, one by one, and only {H} keeps {his} job.'], ['wedding_invite', 'An invitation arrives: {R} is marrying in {CITY}, and wants {H} to give a speech.'], ['strike', 'The vote is taken at {PLACE} and the strike begins tomorrow, with {H} as the one who must lead it.'], ['stranger', 'A stranger at the funeral tells {H} that {LOSS} was not who the family thought.']
    ],
    Comedy: [
      ['double_booking', 'Two weddings arrive at {PLACE} for the same Saturday, and {H} took both deposits.'], ['wrong_name', 'A newspaper names {H} as a local hero for something {R} actually did.'], ['inspection', 'The inspector is coming to {PLACE} on Friday, and {H} has lied about everything on the form.'], ['lottery', '{H} wins a small fortune and cannot tell anyone, because {he} bought the ticket with the office kitty.'], ['fake_partner', 'To win the trip, {H} tells {his} boss {he} is engaged, and {A} agrees to play along for one weekend.'], ['mistaken_identity', 'A tour bus mistakes {PLACE} for a famous hotel, and {H} decides not to correct them.'], ['inheritance_pet', '{H} inherits a very old parrot that knows every secret in the family.'], ['reunion', 'The school reunion committee asks {H} to give the speech, unaware that {he} was expelled.'], ['competition', '{R} enters {PLACE} into the regional competition, naming {H} as captain without asking.'], ['locked_out', 'On the morning of the big presentation, {H} is locked out of {PLACE} wearing only a dressing gown.'], ['twin', 'A man claiming to be {H}\'s long-lost twin moves into the spare room and refuses to leave.'], ['viral', 'A video of {H} falling into the fountain at {PLACE} is watched by half of {CITY} by lunchtime.'], ['wrong_ashes', 'The urn the family scatters at sea turns out to have been {OBJ}, and the real ashes are still at the post office.'], ['job_swap', '{H} and {R} are made to swap jobs for a week as part of a charity stunt.']
    ],
    Crime: [
      ['body', 'A body turns up behind {PLACE}, and the wallet in its pocket is {H}\'s.'], ['missing_money', 'Forty thousand in cash goes missing from {PLACE}, and {R} gives {H} until Monday.'], ['witness', '{H} sees a man killed from the window of {PLACE} and recognises the killer as a policeman.'], ['debt', '{H}\'s brother runs up a debt with {R}, then disappears.'], ['job', 'An old friend offers {H} one easy job: open a safe in {CITY} and walk away rich.'], ['pawned', 'Someone pawns {OBJ} at {PLACE}, and {H} knows it belonged to a woman who has been missing for a month.'], ['frame', 'The police arrive at {PLACE} with a warrant and a gun {H} has never seen.'], ['parole', '{A} gets out on parole and asks {H} to help find the money they buried.'], ['confession', 'A dying man confesses to {H} that the wrong man went to prison for the murder at {PLACE}.'], ['wrong_car', '{H} tows the wrong car, and the boot is full.'], ['partner_shot', '{H}\'s partner is shot on a routine call, and the report has already been written.'], ['ledger', '{H} finds a second set of books in the safe at {PLACE}, listing names from city hall.'], ['client', 'A widow hires {H} to find out who killed her husband, and offers twice the usual fee to stop looking.'], ['fire', 'Overnight {PLACE} burns to the ground, and the insurer asks {H} to prove it was arson.']
    ],
    Thriller: [
      ['wrong_call', 'A call meant for someone else comes through to {H}, and the voice on the line names a time and a place.'], ['dead_drop', '{H} finds a memory card taped under a table at {PLACE}, and a stranger is already watching.'], ['vanished_colleague', '{H}\'s colleague fails to show up at {PLACE}, and every record of him has been deleted by noon.'], ['hostage', 'Six people are taken hostage at {PLACE}, and the man inside will speak only to {H}.'], ['leak', 'A file lands in {H}\'s inbox showing that the last accident at {PLACE} was not an accident.'], ['plane_silent', 'The commuter plane stops answering, and {H} is the last voice it heard.'], ['passport', '{H} arrives in {CITY} to find {his} passport has been used to enter the country two days earlier.'], ['test_result', 'A routine test at {PLACE} shows something in the water that should not exist.'], ['mistaken_courier', '{H} is handed a briefcase meant for {R}, and the handover has already been reported.'], ['witness_wakes', 'The witness under {H}\'s protection wakes in hospital and says the marshal service has a leak.'], ['code', '{H} cracks a message that tells {him} {his} own name is on a list.'], ['camera', 'Watching a security feed, {H} sees {him}self walk into {PLACE} an hour from now.'], ['storm', 'A storm cuts off {PLACE}, and the morning count is one guest short.'], ['offer', '{R} offers {H} a large sum to forget what {he} saw on the night shift.']
    ],
    Horror: [
      ['new_house', '{H} moves into {PLACE} and finds the previous family\'s photographs still on the walls, with the faces scratched out.'], ['knocking', 'Three knocks come from inside the wall of {PLACE} at the same minute every night.'], ['radio_voice', 'A caller rings in to {H}\'s show using the voice of {LOSS}.'], ['missing_child', 'A child goes missing near {PLACE}, and the villagers do not seem surprised.'], ['inheritance', '{H} inherits {PLACE} from a relative nobody knew about, along with a list of rules pinned inside the door.'], ['object_returns', '{H} throws {OBJ} into the river, and the next morning it is on the kitchen table, still wet.'], ['phone_photo', '{H}\'s phone takes a photograph by itself in the night, of {H} asleep.'], ['sleepwalking', '{H} wakes in the garden at {PLACE} with dirt under {his} nails and no memory of digging.'], ['bells', 'The church bells ring at {PLACE} although the bell-ropes were cut years ago.'], ['dead_returns', 'At dusk {H} sees {LOSS} standing at the end of the lane, exactly as at the funeral.'], ['locked_room', 'The estate agent says {PLACE} has one room that must never be opened, then does not come back.'], ['animals_leave', 'Overnight every animal in the valley leaves, and {H} is told to do the same.'], ['dream', 'Everyone at {PLACE} has the same dream on the same night, and {H} is the one in it holding the knife.'], ['tape', '{H} finds an old tape in {PLACE} that records the house\'s sounds, and the sounds include {his} own voice.']
    ],
    Action: [
      ['takeover', 'Armed men take over {PLACE}, and {H} is the only one they did not count.'], ['kidnap', '{H}\'s daughter is taken, and the ransom is a job only {H} can do.'], ['ambush', '{H}\'s convoy is ambushed outside {CITY}, and {he} is the only one left standing.'], ['drive', '{R} needs a drive delivered across the border by dawn, and {H} is the driver.'], ['frame', '{H} is framed for the bombing of {PLACE} and has twelve hours to find the real bomber.'], ['fire', 'A wildfire turns towards {PLACE}, and {H} has a bus full of children and one road.'], ['heist', 'The gang hits {PLACE} on the one day {H} was meant to be off duty.'], ['old_team', 'The old team turns up at {H}\'s door, one man short, and wants {him} back for one job.'], ['crash', '{H}\'s helicopter goes down in the mountains with a prisoner and a broken radio.'], ['storm', 'A storm hits {PLACE} with forty workers still on board, and the rescue boats are an hour out.'], ['bounty', 'A bounty is put on {H}\'s head, and every killer in {CITY} hears the price.'], ['bomb', 'A bomb is found under {PLACE}, and the timer says ninety minutes.'], ['witness', '{H} must get a witness from {PLACE} to the courthouse alive, and everyone between wants him dead.'], ['brother', '{H}\'s brother is arrested abroad, and the embassy says there is nothing it can do.']
    ],
    'Martial arts': [
      ['challenge', 'A fighter from a rival school arrives at {PLACE} and challenges every student to a match.'], ['master_killed', '{H}\'s teacher is found dead at {PLACE}, with the mark of a forbidden technique on his chest.'], ['protection', '{R}\'s men come to {PLACE} to collect protection money, and {H} refuses to pay.'], ['tournament', 'An invitation to a secret tournament arrives with {OBJ} wrapped inside it.'], ['injury', '{H} is badly beaten in public and loses the use of {his} right hand.'], ['stolen_manual', 'The school\'s only copy of the fighting manual is stolen from {PLACE}.'], ['village', 'Bandits ride into the village and give {H} three days to leave or kneel.'], ['brother', '{H}\'s brother is sold into {R}\'s fighting ring to pay a debt.'], ['ban', 'The governor bans {H}\'s style, and the soldiers come to burn {PLACE}.'], ['old_friend', 'A childhood friend turns up at {PLACE} with a sword wound and a name to whisper.'], ['vow', 'On {his} teacher\'s grave, {H} breaks the vow never to fight again.'], ['inheritance', '{H} inherits {PLACE} and its debts, and the rival school wants both.'], ['arrival', 'A stranger walks into {PLACE}, orders tea, and quietly defeats {R}\'s six best men.'], ['poison', 'The town\'s wells are poisoned, and only the herbalist at {PLACE} knows the cure.']
    ],
    Western: [
      ['stagecoach', 'The stagecoach rolls into town with nobody driving it and one passenger alive.'], ['water', '{R} dams the creek above {PLACE}, and the cattle start dying in a week.'], ['prisoner', 'The marshal leaves a prisoner at {PLACE} and rides on, and the prisoner\'s brothers are coming.'], ['homestead', 'Riders burn the barn at {PLACE} and leave a note nailed to the gatepost.'], ['claim', '{H} strikes gold, and the next morning {his} partner is found dead in the creek.'], ['railroad', 'The railroad agent arrives at {PLACE} with papers that say the land is no longer {H}\'s.'], ['wanted', '{H} sees {his} own face on a wanted poster in {CITY}, under a name {he} has not used in years.'], ['orphans', 'A wagon of orphans is left at {PLACE}, and the nearest town is four days away.'], ['letter', 'A telegram arrives from {LOSS}, sent from a town that burned down ten years ago.'], ['sheriff_dead', 'The sheriff is shot in the street, and the town gives the badge to {H}.'], ['horses', 'Every horse at {PLACE} is stolen in the night, with the hardest crossing of the year ahead.'], ['gunfighter', 'A gunfighter rides into town looking for the man who shot his father, and the description fits {H}.'], ['drought', 'The water hole at {PLACE} runs dry, and the only well in the county belongs to {R}.'], ['payroll', 'The mine payroll is stolen from the stage, and the town blames the newcomers.']
    ],
    Romance: [
      ['meet', '{H} and {A} are booked into the same room at {PLACE} by mistake.'], ['ex_wedding', '{H} is invited to the wedding of the one who left, and decides to go with a fake date.'], ['inherit', '{H} inherits half of {PLACE}; the other half belongs to a stranger.'], ['letters', '{H} finds a box of unsent love letters hidden in the wall of {PLACE}.'], ['rival', '{A} opens a rival business directly across the street from {PLACE}.'], ['snowed_in', 'A storm traps {H} and {A} at {PLACE} for three days.'], ['wrong_number', '{H} keeps getting texts meant for someone else, and starts writing back.'], ['old_flame', '{A} walks into {PLACE} after {YEARS} and orders the same drink as last time.'], ['contract', 'The new contract means {H} must work side by side with {A}, who once humiliated {him} in public.'], ['matchmaking', '{H}\'s grandmother puts an advertisement in the paper finding {him} a match.'], ['promise', 'Two friends promised to marry each other if they were single at forty, and it is {H}\'s fortieth birthday.'], ['lost_item', '{H} finds {OBJ} on the train and sets out to return it to its owner.'], ['visa', '{A}\'s visa runs out in three weeks, and {H} has an idea {he} should not say out loud.'], ['wrong_date', 'A blind date at {PLACE} goes wrong because {H} sits down with the wrong stranger.']
    ],
    Musical: [
      ['closing', 'The owner announces that {PLACE} will be sold after one last show.'], ['understudy', 'The lead falls ill on opening night, and {H} is the only one who knows the part.'], ['contest', 'A contest is announced, and the prize is enough to save {PLACE}.'], ['song', '{H} hears {his} own song on the radio, sung by {R} under another name.'], ['ban', 'The new manager bans singing on the floor of {PLACE}.'], ['arrival', 'A stranger with a trumpet case steps off the train and asks the way to {PLACE}.'], ['audition', 'The audition notice goes up on the board, and {H}\'s father tears it down.'], ['lost_voice', '{H} loses {his} voice a week before the biggest night of {his} life.'], ['old_band', '{A} turns up at {PLACE} wanting to put the old band back together.'], ['budget', 'The school cancels the spring show, and the students decide to put it on anyway.'], ['curfew', 'The city announces a curfew, and the cabaret has one night left.'], ['letter', 'A letter from a famous composer invites {H} to play for him in {CITY}.'], ['partner', '{H}\'s dance partner quits two weeks before the championship.'], ['inheritance', '{H} inherits a broken piano and a debt to the owner of {PLACE}.']
    ],
    'Sci-fi': [
      ['signal', 'The array at {PLACE} picks up a signal, and it is {H}\'s own voice asking for help.'], ['wake_early', '{H} wakes from cryosleep forty years early, and the rest of the crew is not in their pods.'], ['slowdown', '{H} measures the station\'s spin and finds it slowing faster than the official reports say.'], ['memory_gap', '{H} discovers that a whole year has been sold from {his} memory, and {he} does not remember selling it.'], ['first_contact', 'A visitor lands outside {PLACE} and asks, in perfect English, for {H} by name.'], ['clone', '{H} meets a clone of {him}self in the corridor of {PLACE}, wearing {his} clothes.'], ['company_silence', 'The company stops answering, and the next supply ship is not coming.'], ['find', 'The miners hit something under {PLACE} that is warm, and humming.'], ['time_permit', '{H}\'s permit to relive one day is stamped, and the day chosen is the day {LOSS} died.'], ['android', 'An android brought into {PLACE} for repair begs {H} not to wipe its memory.'], ['quarantine', 'The quarantine fence goes up around {CITY} overnight, with {H} on the inside.'], ['message', 'A message arrives from Earth that was sent two hundred years ago, addressed to {H}.'], ['ghost_ship', 'A ship reported lost eleven years ago drifts into dock at {PLACE}, its lights still on.'], ['rain', 'The weather board cancels the rain over {H}\'s town for a whole year.']
    ],
    Fantasy: [
      ['prophecy', 'The oracle names {H}, a {JOB}, as the one who will end the king\'s line.'], ['dragon', 'The last dragon in {PLACE} lays an egg, and the court wizard wants it.'], ['name', 'A stranger at {PLACE} speaks {H}\'s true name out loud, and the forest hears it.'], ['map', 'A map at {PLACE} redraws itself to show a road that does not exist.'], ['bargain', '{H} makes a bargain at the fairy market to save {LOSS}, without reading the price.'], ['curse', 'A curse falls on the village, and only {H} remembers the words that could lift it.'], ['crown', 'The princess falls ill, and {H} is ordered to take her place at court.'], ['door', 'The door beneath {PLACE} opens on its own for the first time in a thousand years.'], ['ferry', 'The ferryman of the dead refuses to carry {LOSS} across until {H} pays a debt.'], ['bell', 'The great bell at {PLACE} cracks at its first ring, and the winter starts early.'], ['object', '{H} finds {OBJ} at {PLACE}, and it begins to speak only to {him}.'], ['wall', 'The border wall breaks, and {H}\'s village is the first one on the far side.'], ['king_dies', 'The king dies at supper, and the food taster is accused.'], ['library', 'A book in {PLACE} writes a new chapter about {H}, and it ends badly.']
    ],
    War: [
      ['orders', 'Orders come for {H}\'s unit to take {PLACE} by dawn with half the men they need.'], ['letter', '{H} reads a letter home that the censor should have stopped, and the soldier who wrote it is shot the next day.'], ['missing', '{H}\'s brother is listed as missing at {PLACE}.'], ['code', '{H} breaks a code that shows the next raid is on a city they cannot warn.'], ['wounded_enemy', 'A wounded enemy soldier is brought into {PLACE}, and he is the only one who knows the minefield.'], ['occupation', 'The enemy arrives in the village, and an officer is billeted in {H}\'s house.'], ['radio', 'The radio at {PLACE} goes silent, and the island garrison is alone.'], ['conscription', 'The papers arrive, and {H} has three days before {he} reports.'], ['bridge', '{H}\'s squad is ordered to hold the bridge at {PLACE} until relieved, and nobody comes.'], ['deserter', '{H} finds a deserter hiding in the barn at {PLACE} and must decide whether to report him.'], ['photograph', '{H} takes a photograph at {PLACE} that the army wants destroyed.'], ['escape', 'The prisoners at {PLACE} begin digging, and they need {H}\'s map.'], ['supplies', 'The medical supplies for {PLACE} are sold on the black market, and the wounded keep arriving.'], ['armistice', 'Word comes that the war ends tomorrow at eleven, and the general orders one last attack.']
    ],
    Period: [
      ['debts', 'The family solicitor arrives at {PLACE} with news that every penny is gone.'], ['arrival', 'A new governess arrives at {PLACE} with a letter of reference that is a forgery.'], ['proposal', '{R} proposes to {H} in front of the whole assembly, and refusing would ruin the family.'], ['will', 'The old master\'s will leaves {PLACE} to the servant nobody suspected.'], ['pamphlet', 'A pamphlet printed at {PLACE} names the magistrate as a thief, and {H}\'s initials are on it.'], ['painting', '{H}\'s painting wins the prize, but it was entered under {his} brother\'s name.'], ['letter', 'A letter from {LOSS} arrives three years after the ship went down.'], ['cholera', 'Cholera reaches {CITY}, and {H} is the only one who knows which pump it comes from.'], ['scandal', 'A scandal at the ball means {H}\'s sister must marry within the month.'], ['inheritance', 'A cousin from abroad arrives at {PLACE}, claiming the estate under an older will.'], ['strike', 'The mill hands walk out, and {H}\'s father is the owner.'], ['commitment', '{H}\'s husband signs the papers to have {him} committed to the asylum.'], ['comet', '{H} sees a comet from {PLACE} that no astronomer has recorded.'], ['poacher', '{H}\'s brother is caught poaching on the estate, and the penalty is transportation.']
    ],
    Documentary: [
      ['closure_notice', 'The council posts a notice: {PLACE} will close in six months.'], ['tournament', 'The prodigy is invited to a national tournament in {CITY} that the family cannot afford.'], ['last_season', '{H} announces that this will be {his} last season at {PLACE}.'], ['diagnosis', 'Midway through filming, {H} receives a diagnosis {he} decides to share with the camera.'], ['lease', 'The landlord refuses to renew the lease on {PLACE}.'], ['flood', 'The river rises again, six months after the last flood.'], ['whistle', '{H} decides to go public with what {he} found in the accounts at {PLACE}.'], ['race', '{H} enters a race {he} has trained for for four years, at an age when doctors say {he} should not.'], ['protest', 'The students at {PLACE} plan a walkout on the day of the council vote.'], ['bees', 'The hives at {PLACE} lose half their bees in one week.'], ['permit', 'The prison denies the chess team permission to travel to the final.'], ['comeback', 'A producer offers {H} a comeback role, decades after {his} last screen appearance.'], ['ship_launch', 'The last ship built at {PLACE} is due to launch in the spring.'], ['letter', 'A letter arrives from a relative {H} did not know existed, asking to meet.']
    ],
    Animation: [
      ['lost', '{H} falls out of the delivery van and is lost on the far side of town.'], ['broken', '{H} is found to be a little bit broken, and the city sends a truck to take {him} away.'], ['wind', 'The wind goes missing on the morning of the big festival.'], ['new_kid', 'A new and much shinier toy arrives at {PLACE}, and everyone loves it more than {H}.'], ['map', '{H} finds a map in a bottle that leads to the edge of the world.'], ['storm', 'A storm blows {PLACE} out to sea with everyone still inside.'], ['wish', '{H} wishes on a falling star and wakes up as the exact thing {he} wished to be.'], ['queen', 'The queen of {PLACE} goes missing, and {H} is the smallest one sent to find her.'], ['contest', 'A contest is announced, and the winner gets to fly with the big kites.'], ['moving', '{H}\'s family is moving away from {PLACE} tomorrow, and {he} has not said goodbye to anyone.'], ['ghosts', 'A new family moves into {PLACE}, and the ghosts are terrified of them.'], ['rain_stops', 'It stops raining in the umbrella-makers\' town, and nobody knows why.'], ['egg', '{H} finds an egg that is far too big for any bird in {PLACE}.'], ['clock', 'The town clock stops, and with it, every season.']
    ],
    Superhero: [
      ['accident', 'A lab accident at {PLACE} leaves {H} able to do something impossible.'], ['unmasked', 'A photograph of {H} without the mask is sold to the papers.'], ['mentor_dies', '{H}\'s mentor is killed in the first ten minutes of a fight that was meant to be routine.'], ['registration', 'The government announces that every powered person must register by the end of the month.'], ['lawsuit', 'The city sues {H} for the damage done in the last battle at {PLACE}.'], ['villain_returns', 'A villain who was declared dead {YEARS} ago robs a bank in broad daylight.'], ['powers_fade', '{H}\'s powers begin to fail in the middle of a rescue.'], ['sidekick', 'A teenager with powers turns up at {PLACE} and refuses to go home.'], ['invasion', 'A ship appears above {CITY}, and its first demand is {H}.'], ['clone', '{H} sees {him}self on the news, saving people {he} never saved.'], ['brand', 'The company that pays for {H}\'s suit wants {him} to sell a soft drink.'], ['blackout', 'Every hero in {CITY} loses their powers at the same moment.'], ['old_friend', '{H}\'s oldest friend is revealed as the masked thief behind the museum robberies.'], ['retirement', '{H} announces {his} retirement, and the next morning the crime rate doubles.']
    ]
  },
  reversals: [
    '{A} has been working for {R} all along.', '{R} turns out to be {H}\'s half-brother.', 'The money {H} has been chasing never existed.', '{H} learns that {LOSS} chose to leave.', '{R} is dying, and wants {H} to have {PLACE}.', '{H} wins the fight and discovers it was the one {R} wanted {him} to win.', '{A} confesses to the crime {H} has been blamed for.', 'The letter that started everything was written by {H}\'s mother.', '{H} gets exactly what {he} wanted, and it is worthless.', '{R} saves {H}\'s life, and will not say why.', 'The witness who could clear {H} is found dead at {PLACE}.', '{H} realises {he} has become the person {he} came to stop.', 'It turns out {OBJ} is a fake, and the real one is with {R}.', '{A} leaves, taking the only proof.', 'The police arrest the wrong person, and it is {A}.', '{H} discovers that {R} has been protecting {him} for years.', 'The deal goes through, and {H} finds out what {he} has really sold.', 'Everyone at {PLACE} has known the truth from the start.', '{H} learns that {his} own memory of that night is wrong.', '{R} offers {H} everything {he} wants, on one condition.', 'The plan works perfectly, and someone innocent is hurt.', '{H} is fired, arrested and left by {A} in a single day.', 'The person {H} has been searching for has been beside {him} all along.', '{H}\'s secret comes out in front of everyone at {PLACE}.', '{R} turns out to want the same thing as {H}, for a better reason.', 'The ally who died at the start is alive and on the other side.', '{H} finds proof that {LOSS} was {R}\'s doing.', 'The rescue arrives, and it is worse than what it rescues them from.', '{H} learns {he} was adopted from the family {he} has been fighting.', 'The documents prove {H} has no right to {PLACE} at all.', '{A} is offered {H}\'s job, and takes it.', 'The thing {H} feared most happens, and {he} survives it.', '{R} is arrested, and the trouble only grows.', '{H} finds {OBJ} in {R}\'s house.', 'The child {H} has been protecting is the one in control.', '{H} says the true thing out loud, and loses everyone.', 'The prize is withdrawn the night before it is given.', 'It comes out that {A} has been reading {H}\'s diary.', '{H}\'s hero turns out to have done the very thing {he} despises.', 'The storm wipes out everything {H} has built at {PLACE}.', '{R} hands {H} the gun, and walks away.', 'The vote goes {H}\'s way, and the town turns on {him} for it.', '{H} learns that {he} is the reason {LOSS} happened.', 'Someone is paying {A} to stay close to {H}.', 'The cure works, but only once.', 'The real target was never {H}; it was {A}.', '{H} wins, and the cost arrives by post the next morning.', '{R} disappears, and leaves {H} holding everything.', 'The confession {H} was waiting for is a lie.', '{H} is offered the way out, and refuses it.', 'The person who started it all was trying to help.', 'A second {OBJ} turns up, identical to the first.', '{H}\'s father is alive, and has been living in {CITY} under another name.', 'The old enemy becomes the only one who can help.', '{H} discovers that {PLACE} is already sold.', 'The deadline is moved forward to tomorrow.', '{A} asks {H} to stop, and means it.', 'The thing everyone feared at {PLACE} was a cover for something worse.', '{H} finds out {R} is the one who sent the letter.', 'The truth is told in court, and nobody believes it.'
  ],
  ends: {
    triumph: ['{H} wins, and for once the whole of {PLACE} cheers.', '{H} beats {R} fairly, and offers {rhim} a hand up.', 'The verdict is read, and {H} walks out into the sun with {A}.', '{H} keeps {PLACE} open, and the lights come back on one window at a time.', '{H} stands on the stage {he} was told {he} would never reach.', '{H} brings {OBJ} home and puts it back where it belongs.', '{R} is led away, and {H} finally sleeps through the night.', 'The town turns out to watch {H} cross the finish line.', '{H} gets what {he} wanted and, more importantly, what {he} needed.', '{H} returns to {PLACE} as its owner, and hires everyone back.'],
    pyrrhic: ['{H} wins, and goes home to an empty {PLACE}.', '{R} is beaten, but {A} does not survive the night.', '{H} saves {PLACE} by selling the only thing {he} loved.', 'The case is won, and {H}\'s name is ruined for good.', '{H} gets the title and loses the people who cheered for {him}.', '{H} keeps the promise and breaks {his} own heart doing it.', '{H} brings down {R}, and {PLACE} comes down with {rhim}.', 'The war is won; {H} cannot remember why it was fought.', '{H} survives, the only one who does.', '{H} gets the farm back, and nobody left to work it.'],
    bittersweet: ['{H} lets {A} go, and waves until the train is out of sight.', 'The doors of {PLACE} close for good, and the last night there is the best one.', '{H} forgives {R}, and never sees {rhim} again.', '{H} loses the contest and finds a friend in the winner.', '{H} scatters the ashes, and laughs for the first time in a year.', '{H} leaves {PLACE} for good, with {OBJ} in {his} pocket.', 'The family gathers for one last dinner, and nobody mentions the empty chair.', '{H} gets the letter {he} waited for, years too late, and reads it anyway.', '{H} teaches the new kid everything, and watches the kid take {his} place.', '{H} and {A} part as friends, which is harder than parting as enemies.'],
    tragic: ['{H} dies at {PLACE}, and {R} takes over the next morning.', '{H} makes the right choice too late, and {A} pays for it.', '{H} becomes exactly what {he} feared.', '{H} is convicted, and the real culprit attends the sentencing.', '{H} walks into the sea with {OBJ} in {his} hand.', 'The flaw {H} never fixed costs {him} everything in one night.', '{H} kills {R}, and learns {rhe} was telling the truth.', '{H} is the last to leave {PLACE} before it burns, and does not leave.', '{A} goes to the authorities, and {H} hears the sirens.', '{H} keeps the secret to the grave, and the grave is the next day.'],
    open: ['{H} stands at the crossroads with two tickets and buys neither.', 'The phone rings at {PLACE}, and {H} looks at it, and the screen cuts to black.', '{H} opens the door to whoever is knocking.', '{R} walks free, and {H} follows {rhim} into the crowd.', 'The jury goes out, and {H} waits.', '{H} starts writing the letter, and we never learn what it says.', '{A} asks the question, and {H} takes a long breath.', 'The boat leaves the harbour, and nobody can tell who is on it.', '{H} picks up {OBJ}, and smiles at something we cannot see.', 'Morning comes to {PLACE}, and nobody knows yet what it brings.'],
    ironic: ['{H} gets {PLACE} back, and it is condemned the next week.', '{H} becomes the boss {he} spent the whole story fighting.', '{H} wins the prize for the work {R} stole from {him}.', 'The lie {H} told to save {A} becomes the official history.', '{H} finally escapes, to a town exactly like the one {he} left.', '{R} is ruined by the very scheme {rhe} built to ruin {H}.', '{H} hides the money so well that {he} can never find it.', 'The cure is found the day after {H} stops needing it.', '{H} is celebrated as a hero for the one thing {he} did wrong.', '{H} spends the money on {OBJ}, and loses it on the way home.'],
    reunion: ['{H} and {LOSS} meet again at {PLACE}, older and quieter.', '{A} walks back through the door, and {H} puts on a second cup.', 'The family is together for the first time in {YEARS}.', '{H} finds {his} brother at the station where {he} left him.', 'The old band plays together one more time, badly and gladly.', '{H} and {R} sit down at the same table and call a truce.', '{H} carries {OBJ} to the door of the one {he} lost, and knocks.', 'The whole town comes back to {PLACE} for the reopening.', '{H} and {A} meet at the place they promised, a year late.', 'The letter brings {H}\'s mother home, and she knows the way.'],
    escape: ['{H} drives out of {CITY} at dawn with the window down.', '{H} and {A} slip over the border as the gates close.', '{H} leaves {PLACE} by the back door, and never looks back.', 'The boat pulls away, and {R} is a small shape on the dock.', '{H} walks out of the prison into rain and keeps walking.', '{H} boards the last train with nothing but {OBJ}.', '{H} disappears, and the rumours say {he} is happy.', '{H} cuts the rope, and the balloon lifts {him} over the wall.', '{H} sells everything and takes the road west.', '{H} and the children reach the coast as the sun comes up.']
  },
  images: [
    ['the brass compass', 'that never points north'], ['the red umbrella', 'left open to dry in every scene'], ['the cracked teacup', 'that nobody is allowed to throw away'], ['the wristwatch', 'stopped at twenty past four'], ['the wedding ring', 'worn on a chain around the neck'], ['the paper crane', 'folded from a final demand'], ['the key', 'to a door that was bricked up years ago'], ['the music box', 'that plays one note short'], ['the yellow raincoat', 'two sizes too big'], ['the cassette tape', 'labelled in a dead man\'s hand'], ['the chipped mug', 'with a stranger\'s name on it'], ['the pocket knife', 'that has never been opened'], ['the train ticket', 'for a journey nobody took'], ['the snow globe', 'with a crack where the water leaks out'], ['the hearing aid', 'switched off at every argument'], ['the dog lead', 'hung by the door with no dog'], ['the photograph', 'with one face torn away'], ['the lighter', 'that works only on the third try'], ['the radio', 'tuned to a station that went off air'], ['the bicycle', 'chained to the same railing for {YEARS}'], ['the recipe card', 'stained with every family argument'], ['the hand-knitted scarf', 'unravelling a little more each act'], ['the glass eye', 'kept in a sugar bowl'], ['the boxing gloves', 'hung above the bed'], ['the ledger', 'with one page cut out'], ['the china dog', 'on the mantelpiece, facing the wall'], ['the whistle', 'nobody has blown since the accident'], ['the jar of buttons', 'from every coat in the family'], ['the pair of red shoes', 'never worn outside the house'], ['the harmonica', 'missing its lowest note'], ['the landline phone', 'kept connected for one caller'], ['the medal', 'that belongs to someone else'], ['the fishing rod', 'in its case since the funeral'], ['the deck of cards', 'with one queen missing'], ['the night light', 'shaped like a lighthouse'], ['the bus pass', 'that expired the day {he} left'], ['the coat', 'still smelling of {LOSS}\'s cigarettes'], ['the piano', 'with a key that sticks on the saddest chord'], ['the map', 'with one town circled in red pen'], ['the lipstick', 'used to write on mirrors'], ['the bottle of perfume', 'never opened'], ['the pocket watch', 'that runs backwards'], ['the toy soldier', 'missing its rifle'], ['the jam jar of coins', 'saved for a trip that never happens'], ['the hospital bracelet', 'kept in a wallet'], ['the kite', 'stuck in the tree outside the window'], ['the jigsaw puzzle', 'with the last piece lost'], ['the wooden spoon', 'burnt black at the tip'], ['the motorbike helmet', 'scratched where it hit the road'], ['the telescope', 'pointing at the house across the bay'], ['the old suitcase', 'packed and never unpacked'], ['the church key', 'too big for any pocket'], ['the pair of reading glasses', 'with one lens cracked'], ['the sewing tin', 'full of letters instead of thread'], ['the rocking chair', 'that rocks on its own in a draught'], ['the cigarette case', 'with a bullet dent'], ['the doll', 'with one eye that will not close'], ['the empty birdcage', 'with its door wired shut'], ['the carving knife', 'that only one person is allowed to use'], ['the fountain pen', 'that leaks on every signature'], ['the school blazer', 'too small and kept anyway'], ['the bunch of dried flowers', 'from a wedding that was cancelled'], ['the shoebox', 'of postcards from places {he} never went'], ['the trumpet', 'with a dent from the night of the fight'], ['the stone', 'carried in a pocket since the beach'], ['the wind-up torch', 'that only lasts a minute'], ['the bell', 'from a bicycle that was stolen'], ['the silver spoon', 'that does not match the set'], ['the tattoo', 'of a name {he} will not explain'], ['the clockwork bird', 'that sings at midnight'], ['the passport', 'in someone else\'s name'], ['the welding mask', 'hung on a nail like a face'], ['the apron', 'with the restaurant\'s name embroidered on it'], ['the cowboy hat', 'with a bullet hole through the brim'], ['the tin star', 'pinned upside down'], ['the hymn book', 'with a page of handwritten verses'], ['the cricket bat', 'signed by a team that never won'], ['the trophy', 'kept in a cupboard, not on a shelf'], ['the gas mask', 'hanging on the coat hook'], ['the ration book', 'with one coupon left'], ['the dog tags', 'of a man still listed missing'], ['the fan', 'snapped and glued back together'], ['the locket', 'with two portraits, one scratched out'], ['the silk handkerchief', 'embroidered with initials that are not {his}'], ['the riding crop', 'that nobody in the house has used'], ['the inkwell', 'that has been dry for {YEARS}'], ['the pistol', 'with one bullet in the drawer beside it'], ['the bottle of whisky', 'saved for a day that never comes'], ['the sword', 'too heavy for its owner'], ['the crown', 'made of paper and kept in a box'], ['the lantern', 'that lights only when someone lies'], ['the feather', 'from a bird nobody has seen'], ['the mirror', 'that reflects the room a moment late'], ['the egg', 'that is warm and will not hatch'], ['the ring of keys', 'one of which opens nothing'], ['the spinning top', 'that never quite falls'], ['the robot\'s hand', 'kept in a drawer'], ['the glowing stone', 'that dims whenever {he} is afraid'], ['the space helmet', 'with a crack across the visor'], ['the memory chip', 'labelled with a date in the future'], ['the plastic flower', 'growing in a hydroponics bay'], ['the seed', 'saved from a planet that is gone'], ['the old wristband', 'from the colony\'s first ship'], ['the mask', 'with a stitched-up eye hole'], ['the cape', 'washed so often it has turned grey'], ['the comic book', 'with {H}\'s face on the cover'], ['the cracked visor', 'kept from the first fight'], ['the black belt', 'cut in half'], ['the wooden practice sword', 'worn smooth at the grip'], ['the bowl of rice', 'set out each night for the dead teacher'], ['the tea cup', 'that must not spill during the fight'], ['the folded fan', 'that hides a blade'], ['the bamboo flute', 'played before every duel'], ['the kitchen cleaver', 'kept sharp enough to split a hair'], ['the tap shoes', 'with one plate loose'], ['the microphone', 'that buzzes in the second verse'], ['the sheet music', 'with someone else\'s name crossed out'], ['the jukebox', 'that only plays one song'], ['the costume', 'mended at every seam'], ['the spotlight', 'that will not stay on {H}'], ['the camera', 'with one exposure left'], ['the voice recorder', 'still running in the pocket'], ['the letter', 'opened, resealed and opened again'], ['the clipboard', 'with the list of names'], ['the film reel', 'nobody has watched since 1970'], ['the flag', 'folded the wrong way'], ['the stethoscope', 'worn even off duty'], ['the cash box', 'that is always a little too light'], ['the hotel room key', 'from a hotel that has been demolished'], ['the scratched record', 'that skips at the chorus'], ['the baby shoe', 'bronzed and used as a paperweight'], ['the umbrella', 'with a sword in the handle'], ['the deckchair', 'left out all winter on the pier'], ['the badge', 'returned in an envelope'], ['the necktie', 'that belonged to {his} father'], ['the potted plant', 'that has outlived three owners'], ['the dinner plate', 'set for someone who never comes'], ['the snow chains', 'still in the boot in summer'], ['the hourglass', 'with a crack that leaks sand'], ['the stopwatch', 'that was running when the news came']
  ],
  tricks: {
    linear: ['Told straight', 'The story runs from beginning to end in the order it happened, one day after another.'],
    backwards: ['Told backwards', 'Each scene happens before the one we have just seen, so the ending comes first and the cause comes last.'],
    onenight: ['One night', 'The whole story takes place between dusk and dawn, and the clock is never far away.'],
    oneroom: ['One room', 'Every scene is set in a single room, and the world outside arrives only through its door, windows and telephone.'],
    twotimes: ['Two timelines', 'Two periods of the hero\'s life are cut together until the past explains the present.'],
    mosaic: ['Mosaic', 'Several strangers\' stories cross in one place, and the connections between them are the real plot.'],
    framed: ['Framed tale', 'Someone tells the story to a listener years later, and the telling changes what it means.'],
    unreliable: ['Unreliable teller', 'The narrator is not telling us the truth, and the story is built so that we notice too late.'],
    letters: ['In letters', 'The story is told through letters, messages and recordings left by its people.'],
    chapters: ['In chapters', 'The story is cut into titled chapters, each with its own shape and point of view.'],
    longtake: ['One long take', 'The story plays out in what looks like a single unbroken shot, following the hero from room to room.'],
    dream: ['Dream logic', 'Scenes slide into one another the way they do in dreams, and the rules of time and place bend.'],
    circular: ['Circular', 'The story ends exactly where it began, and the same scene means something new the second time.']
  },
  trickFit: {
    backwards: ['Crime', 'Thriller', 'Drama', 'Romance'],
    onenight: ['Thriller', 'Horror', 'Comedy', 'Crime', 'Action', 'Romance'],
    oneroom: ['Drama', 'Thriller', 'Horror', 'Comedy', 'Crime', 'Period'],
    twotimes: ['Drama', 'Romance', 'War', 'Period', 'Sci-fi', 'Crime'],
    mosaic: ['Drama', 'Comedy', 'Crime', 'War', 'Documentary', 'Superhero'],
    framed: ['Period', 'Western', 'War', 'Fantasy', 'Romance', 'Documentary', 'Animation'],
    unreliable: ['Thriller', 'Crime', 'Horror', 'Drama', 'Comedy'],
    letters: ['Romance', 'War', 'Period', 'Drama', 'Horror'],
    chapters: ['Western', 'Fantasy', 'Martial arts', 'Drama', 'Documentary', 'Crime'],
    longtake: ['Action', 'Thriller', 'War', 'Musical', 'Horror', 'Martial arts'],
    dream: ['Fantasy', 'Horror', 'Animation', 'Musical', 'Sci-fi'],
    circular: ['Sci-fi', 'Drama', 'Fantasy', 'Western', 'Animation', 'Comedy']
  },
  genreHooks: {
    Drama: ['a slow-burn family reckoning', 'a quiet story about people who stay', 'a portrait of a town at the end of something', 'a hard conversation held off for two hours', 'a small life told at full size', 'a character study with no easy villains', 'a story of work and what it costs', 'an argument that has been going on for {YEARS}', 'a grief that finally gets spoken', 'a second chance nobody quite deserves'],
    Comedy: ['a farce that keeps adding one more lie', 'a fish out of water who refuses to get back in', 'an ensemble of lovable disasters', 'a deadpan look at a very small world', 'escalating embarrassment with a warm heart', 'a rivalry that gets out of all proportion', 'a cringe that turns into a cheer', 'a misunderstanding that nobody wants to correct', 'a gang of misfits against a pompous rule', 'a ridiculous plan that nearly works'],
    Crime: ['a tight procedural with a moral sting', 'a heist that goes wrong in the right way', 'a slow descent into the underworld', 'a whodunit where everyone had a reason', 'a cat-and-mouse between two patient people', 'a city where the honest man is the outsider', 'a debt that keeps getting more expensive', 'a cop and a criminal who understand each other', 'a cover-up told from the inside', 'a last job with too many partners'],
    Thriller: ['a ticking clock and a shrinking circle of trust', 'an ordinary person in over their head', 'a conspiracy that reaches the people who hired you', 'a paranoid chase across a cold city', 'a locked-in standoff with no exit', 'a mystery where the hero is the suspect', 'a deal with someone you cannot see', 'a race against a deadline set by a stranger', 'a twist that rearranges everything before it', 'a slow tightening of the screws'],
    Horror: ['a creeping dread in a familiar place', 'a house that wants something', 'a village with an old arrangement', 'a grief that becomes a haunting', 'a night that will not end', 'a slow-burn mystery with a shocking last door', 'a fear that the family will not name', 'a folk ritual that is still observed', 'a monster that is mostly glimpsed', 'a final girl who refuses to be one'],
    Action: ['a relentless chase with no time to breathe', 'a one-against-many siege', 'a reluctant hero pulled back for one more job', 'a ticking bomb and a burning building', 'a road movie at full throttle', 'a team assembled for an impossible mission', 'a rescue against the clock', 'a revenge run through a whole city', 'a big set piece every twenty minutes', 'a fight for a family with fists and engines'],
    'Martial arts': ['a humble master hiding in plain sight', 'a tournament with a secret at its heart', 'a school against a gang', 'a pupil\'s long road to mastery', 'a revenge in forms and footwork', 'a fight choreographed like a dance', 'a village defended by one quiet fighter', 'a lost style rediscovered', 'a rivalry between two schools and two brothers', 'a final duel that settles an old debt'],
    Western: ['a lone rider and a town that needs him', 'a land war fought with fences and rifles', 'a frontier where the law is a rumour', 'a slow ride to a reckoning', 'a showdown at the end of a long wait', 'a homestead held against the odds', 'a journey across hard country', 'an outlaw trying to go straight', 'a town split down the middle', 'a revenge that crosses three territories'],
    Romance: ['a will-they-won\'t-they with real stakes', 'a slow-burn courtship over one summer', 'a love that arrives at the worst possible time', 'two rivals who fall for each other', 'a second chance at a first love', 'a romance across a border', 'a fake relationship that turns real', 'a love story told in missed connections', 'a meet-cute in a terrible situation', 'a grown-up romance about what love costs'],
    Musical: ['a let\'s-put-on-a-show with everything to lose', 'a backstage story where every song moves the plot', 'a working town that sings its troubles', 'a rise from the chorus to the spotlight', 'a love story told in duets', 'a dance contest with a heart', 'a jukebox of feelings set in one street', 'a showstopper in the second act', 'a family that can only say it in song', 'a big finale that brings the whole town in'],
    'Sci-fi': ['a big idea with a human cost', 'a lonely outpost and a signal from the dark', 'a future that looks too much like the present', 'a mystery aboard a ship far from home', 'a question about what makes a person', 'a first contact that goes sideways', 'a time puzzle with an emotional key', 'a dystopia told from the inside', 'a survival story on a hostile world', 'a machine that wants something'],
    Fantasy: ['a quest with a map and a cost', 'a hidden world behind an ordinary door', 'a chosen one who would rather not be', 'a court full of intrigue and old magic', 'a bargain with a creature that keeps its word', 'a coming-of-age with dragons in it', 'a fairy tale with its edges sharpened', 'a kingdom saved by its smallest person', 'a magic system with strict rules', 'a war between seasons'],
    War: ['a platoon of strangers who become kin under fire', 'the cost of one hill', 'a home front waiting for news', 'a mission behind the lines', 'an enemy who turns out to be a man', 'a siege that tests a whole city', 'a story of medics and the men they lose', 'a moral choice in the fog of war', 'a homecoming that is its own battle', 'a war told from the cookhouse'],
    Period: ['a costume drama with a sharp modern edge', 'a marriage plot with money underneath', 'a great house where the servants know everything', 'a woman ahead of her time', 'a scandal in a small society', 'a reform fight against a powerful family', 'an inheritance mystery in a great house', 'a forbidden romance across class lines', 'a slow social comedy of manners', 'a portrait of an age through one household'],
    Documentary: ['an intimate portrait of an ordinary hero', 'a year in the life of a place about to change', 'an underdog story with no script', 'a fight against a big institution', 'a quiet observation that becomes a thriller', 'a story of a community that refuses to give up', 'a personal journey into family history', 'a competition seen from the inside', 'a profile of a craft that is disappearing', 'a reckoning with an old injustice'],
    Animation: ['a big adventure for a small hero', 'a buddy road trip across a strange land', 'a world where objects have feelings', 'a story about growing up told with talking animals', 'a slapstick chase with a tender middle', 'a quest to get home', 'a fable for children that adults cry at', 'an underdog who saves the day by being different', 'a bright, funny world with a sad secret', 'a family story in a fantastical setting'],
    Superhero: ['an origin story with real-world stakes', 'a hero torn between the mask and the person', 'a villain with a point', 'a team-up of reluctant heroes', 'a city that has to save itself', 'a hero on the edge of retirement', 'a powers story about responsibility', 'a battle with the whole skyline at stake', 'a secret identity under pressure', 'a hero who must lose to win']
  }
};
