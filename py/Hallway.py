class Hallway(object):
	def __init__(self,  sideA, sideB, char = ' '):
		#sideA will always be the far left or the topmost.
		#enforce alignment
		self.character = char
		
		if(sideA.isVerticallyAligned(sideB)):
			self.isVertical = True
			if(sideA.y < sideB.y):
				self.pointA = sideA
				self.pointB = sideB
			else:
				self.pointA = sideB
				self.pointB = sideA
		elif sideA.isHorizontallyAligned(sideB):
				self.isVertical = False
				if sideA.x < sideB.x:
					self.pointA = sideA
					self.pointB = sideB
				else:
					self.pointA = sideB
					self.pointB = sideA
		else:
			raise Exception('Hallway','Hallways can only be a line')
				
	def __eq__(self, rhs):
		if isinstance(rhs, Hallway):
			return (self.pointA == rhs.pointA and self.pointB == rhs.pointB)
		else:
			return NotImplemented