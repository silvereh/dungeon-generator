#!/usr/bin/env python
# -*-coding:Utf-8 -*

#external modules
import sys, random, getopt
from array import *

#our modules/files
from Point import *
from Room import *
from Hallway import *

#Move min max to own named variables
#Min room #, max room #
MAP_SIZE = {
	'-s' : 'sm',
	'sm' : 'sm',
	'--small' : 'sm',
	'-m' : 'md',
	'md' : 'md',
	'--medium' : 'md',
	'-l' : 'lg',
	'lg' : 'lg',
	'--large' : 'lg'
}

MAP_DIM_X = {
	'sm': 51,
	'md': 76,
	'lg': 100
}
MAP_DIM_Y = {
	'sm': 51,
	'md': 76,
	'lg': 100
}

MAX_ROOM_NUMBER = {
	'sm': 11,
	'md': 16,
	'lg': 24
}
MAX_DIST_FOR_HALLWAYS = {
	'sm': 40,
	'md': 65,
	'lg': 80
}

MIN_ROOM_X = {
	'sm': 4,
	'md': 5,
	'lg': 6
}
MAX_ROOM_X = {
	'sm': 8,
	'md': 12,
	'lg': 16
}
MIN_ROOM_Y = {
	'sm': 4,
	'md': 5,
	'lg': 6
}
MAX_ROOM_Y = {
	'sm': 8,
	'md': 12,
	'lg': 16
}

#A room should be 4x4 at the smallest, and 8x8 at largest
ROOM_DIMS = DimRange(MIN_ROOM_X.get('sm', 4), MIN_ROOM_Y.get('sm', 4), MAX_ROOM_X.get('sm', 8), MAX_ROOM_Y.get('sm', 8))
DIRECTIONS = ['right', 'left', 'upper', 'lower']

class Map(object):
	"""docstring for Map"""
	# def __init__(self, width, height):
	def __init__(self, width, height, mapSize, roomNum):
		self.width = width
		self.height = height
		
		#iterate over the map and fill it with wall tiles
		# self._map = ["-" for i in xrange(0, width * height)] 
		# self._map = ["◊" for i in xrange(0, width * height)] 
		self._map = ["0" for i in xrange(0, width * height)] 

		self.mapSize = mapSize

		hallwayDist = MAX_DIST_FOR_HALLWAYS.get(self.mapSize, 40)
		# self.roomNum = roomNum
		# roomDims = DimRange(roomMin, roomMin, roomMax, roomMax)
		# self.roomDims = roomDims

		self.rooms = [Room(self, ROOM_DIMS)] * roomNum
		
		for i in xrange(0, roomNum):
			self.rooms[i].myIndex = i
			#print "Testing to see if room: %d intersects with another room" %i
			while(self.isRoomIntersectingAnotherRoom(i)):
				self.rooms[i] = self.RollRoom(i)
				
		self.proximities = []
		self.buildAndSortProximities()
		
		self.hallways = []
		self.makeHallways(hallwayDist)

	def __str__(self):
		return "\n".join(["".join(self._map[start:start + self.width]) for start in xrange(0, self.height * self.width, self.width)])
		
	def addRoomToString(self, room, ci):
		for i in [x + y * self.width for x in xrange(room.TopLeft.x, room.BotRight.x) for y in xrange(room.TopLeft.y, room.BotRight.y)]:
			# self._map[i] = chr(ord(room.character)+ci)
			self._map[i] = room.character

	def addHallwaysToString(self):
		for l, item in enumerate(self.hallways):
			h = self.hallways[l]
			#print "Adding hallway: %d to string" %l,
			#print " Hallway verticality: " + str(h.isVertical)
			if(h.isVertical):
				for i in xrange(h.pointA.y - 1, h.pointB.y + 1):
					idx = (i * self.width) + h.pointA.x
					# self._map[idx] = chr(ord('A')+l)
					# self._map[idx] = '·'
					self._map[idx] = '.'
			else:
				for i in xrange(h.pointA.x - 1, h.pointB.x + 1):
					# self._map[i + (h.pointA.y * self.width)] = chr(ord('A')+l)
					# self._map[i + (h.pointA.y * self.width)] = '·'
					self._map[i + (h.pointA.y * self.width)] = '.'

	def isRoomIntersectingAnotherRoom(self, index):
		roomNum = len(self.rooms)
		for i in xrange(0, roomNum):
			#'''and (self.rooms[index] != None)''' 
			if (i != index) and (self.rooms[i] != None):
				if (self.rooms[index].intersects(self.rooms[i])):
					return True
			#Depends on the linear insertion into the room array object
			if(self.rooms[index] == None):
				return False
		return False
		
	def removeRoomsNotInDirectLine(self, proximities):
		savedProximities = []
		
		for d in DIRECTIONS:
			foundFirst = False
			for p in proximities:
				if p[1] == d  and not foundFirst:
					savedProximities.append(p)
					foundFirst = True
		return savedProximities

	def getRoomProximities(self, i):
		roomNum = len(self.rooms)
		#search for horizontal
		for j in xrange(0, roomNum):
			if i != j:
				#print 'Index i: {0:2d} Index j: {1:2d}'.format(i, j)
				sA = self.rooms[i].sharedAxis(self.rooms[j])
				p = self.rooms[i].findClosestWallsAndTheirDistances(self.rooms[j], sA)
				if p != None:
					self.proximities[i].append((j, p[0], p[1]))
					
		#print "Proximities found for room: %d with the following rooms:" %i
		self.proximities[i].sort(key=lambda x: (x[2], [1]))
		self.proximities[i] = self.removeRoomsNotInDirectLine(self.proximities[i])
		
		for p in xrange(0, len(self.proximities[i])):
			if self.proximities[i][p][1] == None:
				del self.proximities[i][p]

	def shiftRoomLeft(self, i):
		leftMapWallDist = abs(1 - self.rooms[i].TopLeft.x)
		print "Shifting Room Left"
		while(leftMapWallDist > self.rooms[i].getWidth() and len(self.proximities[i]) == 0):
			self.rooms[i].shiftMe("Left")
			self.getRoomProximities(i)
			leftMapWallDist = abs(1 - self.rooms[i].TopLeft.x)
		print "Shifted Room Left"

	def shiftRoomRight(self, i):
		rightMapWallDist = abs((self.width-1) - self.rooms[i].BotRight.x)
		print "Shifting Room Right"
		while(rightMapWallDist > self.rooms[i].getWidth() and len(self.proximities[i]) == 0):
			self.rooms[i].shiftMe("Right")
			self.getRoomProximities(i)
			rightMapWallDist = abs((self.width-1) - self.rooms[i].BotRight.x)
		print "Shifted Room Right"
		
	def shiftRoomUp(self, i):
		topMapWallDist = abs(1 - self.rooms[i].TopLeft.y)
		print "Shifting Room Up"
		while(topMapWallDist > self.rooms[i].getHeight() and len(self.proximities[i]) == 0):
			self.rooms[i].shiftMe("Up")
			self.getRoomProximities(i)
			topMapWallDist = abs(1 - self.rooms[i].TopLeft.y)
		print "Shifted Room Up"
		
	def shiftRoomDown(self, i):
		botMapWallDist = abs((self.height-1) - self.rooms[i].BotRight.y)
		print "Shifting Room Down"
		while(botMapWallDist > self.rooms[i].getHeight() and len(self.proximities[i]) == 0):
			self.rooms[i].shiftMe("Down")
			self.getRoomProximities(i)
			botMapWallDist = abs((self.height-1) - self.rooms[i].BotRight.y)
		print "Shifted Room Down"
		
	def shiftRoomAsNeeded(self, i):
		roomNum = len(self.rooms)
		if len(self.proximities[i]) > 0:
			return
		elif roomNum == 1:
			return
		
		self.shiftRoomLeft(i)
		self.shiftRoomRight(i)
		self.shiftRoomUp(i)
		self.shiftRoomDown(i)
		
		if len(self.proximities[i]) == 0:
			print "Ran both up, down, left, right, and still could not find a room"
			
	def buildAndSortProximities(self):
		roomNum = len(self.rooms)
		#search horizontally
		self.proximities = []
		
		for i in xrange(0, roomNum):
			#list rooms in order of proximity.
			self.proximities.append([])
			self.getRoomProximities(i)
			self.shiftRoomAsNeeded(i)
				
	def makeHallways(self, max_distance):
		#print "Making Hallways"
		for i in xrange(0, len(self.proximities)):
			for x in self.proximities[i]:
				if x[2] < max_distance and not self.rooms[i].sharesHallwayWith(x[0]):
					(ptA, ptB) = self.rooms[i].makeDoors(x[1], self.rooms[x[0]])
					self.rooms[i].addDoor(ptA, x[0])
					self.rooms[x[0]].addDoor(ptB, i)
					self.hallways.append(Hallway(ptA, ptB))
				
	def RollRoom(self, index):
		room = Room(self, ROOM_DIMS, index)
		return room 
		
if __name__ == '__main__':
	arg = sys.argv[1] if (len(sys.argv) > 1) else 'err'

	mapSize = MAP_SIZE.get(arg, 'err')

	if arg == 'err' or mapSize == 'err':
		print 'usage: DungeonGenerator.py -[size = s, m, l]'
		sys.exit(2)

	minRoomX = MIN_ROOM_X.get(mapSize, 4)
	minRoomY = MIN_ROOM_Y.get(mapSize, 4)
	maxRoomX = MAX_ROOM_X.get(mapSize, 8)
	maxRoomY = MAX_ROOM_Y.get(mapSize, 8)
	ROOM_DIMS = DimRange(minRoomX, minRoomY, maxRoomX, maxRoomY)

	mapX = MAP_DIM_X.get(mapSize, 51)
	mapY = MAP_DIM_Y.get(mapSize, 51)

	roomNumMin = MAX_ROOM_NUMBER.get(mapSize, 10) - 2
	roomNumMax = MAX_ROOM_NUMBER.get(mapSize, 10) + 2

	roomNum = random.randint(roomNumMin, roomNumMax)
	map = Map(mapX, mapY, mapSize, roomNum)

	for x in xrange(0, roomNum):
		map.RollRoom(x)
		map.addRoomToString(map.rooms[x], x)

	map.addHallwaysToString()

	with open('../assets/map.txt', 'w') as f:
		print >> f, map

	# Console 80 * 24
