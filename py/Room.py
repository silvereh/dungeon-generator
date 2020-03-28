#!/usr/bin/env python
# -*-coding:Utf-8 -*

import random
import sets

from Point import *

#A utility class for describing the range of sizes of rooms
class DimRange(object):
	def __init__(self, x1, y1, x2, y2):
		self.min = Point(x1, y1)
		self.max = Point(x2, y2)

class Door(object):
	#in order to be a valid passage object we must be attached at the hallway.
	def __init__(self, pt):
		self.location = pt #Point object		

	def __eq__(self, rhs):
		if isinstance(rhs, Door):
			return self.location == rhs.location
		elif isinstance(rhs, Point):
			return self.location == rhs
		else:
			return NotImplementedError()
		
class Room(object):
	# def __init__(self, map, minMaxRange, index=0, char='a'):
	# def __init__(self, map, minMaxRange, index=0, char='·'):
	def __init__(self, map, minMaxRange, index=0, char='.'):
		#far left of room - should always be the max range away from the outer wall
		x1 = random.randrange(1, (map.width - minMaxRange.max.x))
		#upper wall of room - same as above.
		y1 = random.randrange(1, (map.height - minMaxRange.max.y))
		self.TopLeft = Point(x1, y1)
		#Far right of room
		x2 = x1 + random.randrange(minMaxRange.min.x, minMaxRange.max.x + 1)

		#lower wall of room
		y2 = y1 + random.randrange(minMaxRange.min.y, minMaxRange.max.y + 1)
		self.BotRight = Point(x2, y2)
		
		#my index from inside of the map class
		self.myIndex = index
		
		#If it has at least ONE hallway.
		self.HasHallway = False
		
		#the character which represents each room
		self.character = char
		
		#rooms which we want to make
		self.doors = []
		self.roomsAttachedTo = []
		
	def findMatchingRange(self, wall, roomB):
		if wall == 'left' or wall == 'right':
			sharedPoints = sets.Set(range(self.TopLeft.y, self.BotRight.y + 1))
			sharedPoints &= sets.Set(range(roomB.TopLeft.y, roomB.BotRight.y + 1))

		if wall == "upper" or wall == "lower":
			sharedPoints = sets.Set(range(self.TopLeft.x, self.BotRight.x + 1))
			sharedPoints &= sets.Set(range(roomB.TopLeft.x, roomB.BotRight.x + 1))

		return sharedPoints
			
	def findHallwayDirectlyBetween(self, test):
		for h in self.Hallways:
			if test.Hallways.index(h) != None:
				print "Found a hallway between: Room: {0:2d} and {0:2d}, hallway: {0:2d}".format(self.myIndex, test.myIndex, h)
				return (True, h)

		return (False, None, None)
		
	def sharesHallwayWith(self, roomIndex):
		return (self.roomsAttachedTo.count(roomIndex) > 0)
		
	def makeDoors(self, wall, roomB):
		sp = self.findMatchingRange(wall, roomB)
		
		ptReturn = random.choice(tuple(sp)) 
		#print "Points in common: " + str(sp),
		#print " ptReturn : {0:2d}".format(ptReturn)
		
		if wall == 'left':
			pt = Point(self.TopLeft.x, ptReturn)
			bPt = Point(roomB.BotRight.x, ptReturn)
		if wall == 'right':
			pt = Point(self.BotRight.x, ptReturn)
			bPt = Point(roomB.TopLeft.x, ptReturn)
		if wall == 'upper':
			pt = Point(ptReturn, self.TopLeft.y)
			bPt = Point(ptReturn, roomB.BotRight.y)
		if wall == 'lower':
			pt = Point(ptReturn, self.BotRight.y)
			bPt = Point(ptReturn, roomB.TopLeft.y)
		
		#print "Putting doors at: " + str (pt) + " and: " + str(bPt)
		
		return (pt, bPt)

	def getHeight(self):
		return (self.BotRight.y - self.TopLeft.y)
	
	def getWidth(self):
		return (self.BotRight.x - self.TopLeft.x)

	#try to create a door at the point.
	def addDoor(self, pt, testIdx):
		#check to see if we are already directly connected
		if self.roomsAttachedTo.count(testIdx) == 0:
			if self.doors.count(pt) > 0:
				return
			self.roomsAttachedTo.append(testIdx)
			self.doors.append(Door(pt))
		else:
			return 
			
	def isPointInside(self, x, y):
		if((x >= self.TopLeft.x and x <= self.BotRight.x) and (y >= self.TopLeft.y and y <= self.BotRight.y)):
			return True
		else:
			return False
			
	#return true if there is intersection between this room
	# and another room - this tests to see if the top is lower than the lowest of the one to test.
	def intersects(self, test):
		return not (self.TopLeft.x > test.BotRight.x or self.BotRight.x < test.TopLeft.x
			    or self.TopLeft.y > test.BotRight.y or self.BotRight.y < test.TopLeft.y)
		
	#Find the wall closest to the one we're testing
	def findClosestWallsAndTheirDistances(self, testRm, axis):
		if axis != None:
			if axis == 'horizontal' :
				#the higher it is, the firther to the right it is.
				if self.TopLeft.x > testRm.BotRight.x:
					return ("left", abs(self.TopLeft.x - testRm.BotRight.x))
				if self.TopLeft.x < testRm.BotRight.x:
					return ("right", abs(self.BotRight.x - testRm.TopLeft.x))
			else:
				#the higher the number it is, the lower it is
				if self.TopLeft.y > testRm.BotRight.y: 
					return ("upper", abs(self.TopLeft.y - testRm.BotRight.y))
				else:
					return ("lower", abs(self.BotRight.y - testRm.TopLeft.y))
		else:
			return None
		
	def shiftMe(self, direction):
		if direction == "Left" or direction == "Right":
			amount = (self.BotRight.x - self.TopLeft.x)
			if direction == "Left":
				self.TopLeft.x -= amount
				self.BotRight.x -= amount
			elif direction == "Rght":
				self.Topleft.x += amount
				self.BotRight.x += amount
				
		elif direction == "Up" or direction == "Down":
			amount = (self.BotRight.y - self.TopLeft.y)
			if direction == "Up":
				self.TopLeft.y -= amount
				self.BotRight.y -= amount
			elif direction == "Down":
				self.TopLeft.y += amount
				self.BotRight.y += amount

		else: 
			print "Error, invalid input: %s", direction

	def sharedAxis(self, test):
		for i in xrange(self.TopLeft.y, self.BotRight.y + 1):
			if test.isPointInside(test.TopLeft.x, i):
				return 'horizontal'

		for i in xrange(self.TopLeft.x, self.BotRight.x + 1):
			if test.isPointInside(i, test.BotRight.y):
				return 'vertical'
#				return self.findClosestWallsAndTheirDistances(test, True)
		return None
